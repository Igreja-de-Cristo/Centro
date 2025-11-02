const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    youtubeId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    category: {
        type: String,
        enum: ['cultos', 'estudos', 'eventos', 'series'],
        required: true
    },
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    sortOrder: {
        type: Number,
        default: 0
    },
    analytics: {
        totalViews: {
            type: Number,
            default: 0
        },
        lastUpdated: Date,
        videosCount: {
            type: Number,
            default: 0
        }
    },
    metadata: {
        thumbnails: {
            default: String,
            medium: String,
            high: String
        },
        tags: [String],
        visibility: {
            type: String,
            enum: ['public', 'unlisted', 'private'],
            default: 'public'
        }
    }
}, {
    timestamps: true
});

// Índices
playlistSchema.index({ youtubeId: 1 });
playlistSchema.index({ category: 1 });
playlistSchema.index({ 'analytics.totalViews': -1 });

// Métodos
playlistSchema.methods.updateAnalytics = async function() {
    const videos = await mongoose.model('Video').find({
        _id: { $in: this.videos }
    });
    
    this.analytics.totalViews = videos.reduce((sum, video) => 
        sum + video.analytics.views, 0);
    this.analytics.videosCount = videos.length;
    this.analytics.lastUpdated = new Date();
    
    await this.save();
};

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;