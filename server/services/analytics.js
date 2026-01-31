const mongoose = require('mongoose');
const winston = require('winston');
const Video = require('../models/Video');
const Playlist = require('../models/Playlist');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'analytics.log' })
    ]
});

class AnalyticsService {
    async trackVideoView(videoId, userInfo = {}) {
        try {
            const video = await Video.findOne({ youtubeId: videoId });
            if (!video) return null;

            // Incrementar visualizações
            await video.incrementViews();

            // Registrar informações detalhadas da visualização
            const analyticsData = {
                videoId: video._id,
                timestamp: new Date(),
                userAgent: userInfo.userAgent,
                ipAddress: userInfo.ipAddress,
                referrer: userInfo.referrer,
                duration: userInfo.duration
            };

            // Salvar em uma coleção separada para análise detalhada
            await mongoose.model('VideoAnalytics').create(analyticsData);

            // Atualizar playlist se existir
            if (video.playlist) {
                const playlist = await Playlist.findById(video.playlist);
                if (playlist) {
                    await playlist.updateAnalytics();
                }
            }

            return video;
        } catch (error) {
            logger.error('Erro ao registrar visualização:', error);
            throw error;
        }
    }

    async getVideoStats(videoId) {
        try {
            const video = await Video.findOne({ youtubeId: videoId });
            if (!video) return null;

            const analytics = await mongoose.model('VideoAnalytics')
                .find({ videoId: video._id })
                .sort({ timestamp: -1 })
                .limit(100);

            return {
                totalViews: video.analytics.views,
                engagementScore: video.analytics.engagementScore,
                viewHistory: video.analytics.viewsHistory,
                recentViews: analytics
            };
        } catch (error) {
            logger.error('Erro ao buscar estatísticas:', error);
            throw error;
        }
    }

    async getTopVideos(category = null, limit = 10) {
        try {
            const query = category ? { category } : {};
            return await Video.find(query)
                .sort({ 'analytics.engagementScore': -1 })
                .limit(limit);
        } catch (error) {
            logger.error('Erro ao buscar vídeos mais populares:', error);
            throw error;
        }
    }

    async generateReport(startDate, endDate) {
        try {
            const videos = await Video.find({
                'analytics.viewsHistory.date': {
                    $gte: startDate,
                    $lte: endDate
                }
            });

            const playlists = await Playlist.find();

            const report = {
                period: {
                    start: startDate,
                    end: endDate
                },
                summary: {
                    totalViews: videos.reduce((sum, v) => sum + v.analytics.views, 0),
                    totalVideos: videos.length,
                    totalPlaylists: playlists.length,
                    averageViewsPerVideo: 0,
                    mostViewedCategory: null
                },
                topVideos: await this.getTopVideos(null, 5),
                categoryBreakdown: {},
                playlistPerformance: []
            };

            // Calcular média
            report.summary.averageViewsPerVideo = 
                report.summary.totalViews / report.summary.totalVideos;

            // Análise por categoria
            videos.forEach(video => {
                if (!report.categoryBreakdown[video.category]) {
                    report.categoryBreakdown[video.category] = {
                        views: 0,
                        videos: 0
                    };
                }
                report.categoryBreakdown[video.category].views += video.analytics.views;
                report.categoryBreakdown[video.category].videos++;
            });

            // Encontrar categoria mais visualizada
            report.summary.mostViewedCategory = Object.entries(report.categoryBreakdown)
                .sort((a, b) => b[1].views - a[1].views)[0][0];

            // Análise de playlists
            for (const playlist of playlists) {
                report.playlistPerformance.push({
                    title: playlist.title,
                    totalViews: playlist.analytics.totalViews,
                    videosCount: playlist.analytics.videosCount,
                    averageViewsPerVideo: 
                        playlist.analytics.totalViews / playlist.analytics.videosCount
                });
            }

            return report;
        } catch (error) {
            logger.error('Erro ao gerar relatório:', error);
            throw error;
        }
    }

    async cleanOldAnalytics() {
        try {
            const retentionDays = process.env.ANALYTICS_RETENTION_DAYS || 30;
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

            await mongoose.model('VideoAnalytics').deleteMany({
                timestamp: { $lt: cutoffDate }
            });

            logger.info(`Dados de analytics anteriores a ${cutoffDate} foram removidos`);
        } catch (error) {
            logger.error('Erro ao limpar dados antigos:', error);
            throw error;
        }
    }
}

module.exports = new AnalyticsService();