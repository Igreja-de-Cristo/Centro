const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Video = require('../models/Video');
const SecurityService = require('../services/security');
const AnalyticsService = require('../services/analytics');

// Middleware de autenticação
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Autenticação necessária' });
        }

        const decoded = SecurityService.verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Erro na autenticação' });
    }
};

// Validação para adição de vídeo
const validateVideo = [
    check('youtubeId').trim().notEmpty().withMessage('ID do YouTube é obrigatório'),
    check('title').trim().notEmpty().withMessage('Título é obrigatório'),
    check('category').isIn(['culto', 'estudo', 'evento']).withMessage('Categoria inválida'),
];

// Listar todos os vídeos
router.get('/', async (req, res) => {
    try {
        const { category, featured } = req.query;
        const query = {};

        if (category) {
            query.category = category;
        }
        if (featured === 'true') {
            query.featured = true;
        }

        const videos = await Video.find(query)
            .sort({ 'analytics.engagementScore': -1 })
            .limit(20);

        res.json(videos);
    } catch (error) {
        console.error('Erro ao listar vídeos:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Adicionar novo vídeo
router.post('/', [auth, validateVideo], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Sanitizar entrada
        const videoData = SecurityService.sanitizeInput({
            youtubeId: req.body.youtubeId,
            title: req.body.title,
            customTitle: req.body.customTitle,
            description: req.body.description,
            category: req.body.category,
            featured: req.body.featured || false
        });

        const video = new Video(videoData);
        await video.save();

        SecurityService.logSecurityEvent({
            type: 'video_added',
            user: req.user.id,
            videoId: video._id
        });

        res.status(201).json(video);
    } catch (error) {
        console.error('Erro ao adicionar vídeo:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Atualizar vídeo
router.patch('/:id', auth, async (req, res) => {
    try {
        const updates = SecurityService.sanitizeInput(req.body);
        const video = await Video.findById(req.params.id);
        
        if (!video) {
            return res.status(404).json({ message: 'Vídeo não encontrado' });
        }

        Object.keys(updates).forEach(key => {
            if (key !== '_id' && key !== 'youtubeId') {
                video[key] = updates[key];
            }
        });

        await video.save();

        SecurityService.logSecurityEvent({
            type: 'video_updated',
            user: req.user.id,
            videoId: video._id
        });

        res.json(video);
    } catch (error) {
        console.error('Erro ao atualizar vídeo:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Excluir vídeo
router.delete('/:id', auth, async (req, res) => {
    try {
        const video = await Video.findByIdAndDelete(req.params.id);
        
        if (!video) {
            return res.status(404).json({ message: 'Vídeo não encontrado' });
        }

        SecurityService.logSecurityEvent({
            type: 'video_deleted',
            user: req.user.id,
            videoId: req.params.id
        });

        res.json({ message: 'Vídeo removido com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir vídeo:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Registrar visualização
router.post('/:id/view', async (req, res) => {
    try {
        const userInfo = {
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip,
            referrer: req.headers.referer,
            duration: req.body.duration
        };

        const video = await AnalyticsService.trackVideoView(req.params.id, userInfo);
        
        if (!video) {
            return res.status(404).json({ message: 'Vídeo não encontrado' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao registrar visualização:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Obter estatísticas do vídeo
router.get('/:id/stats', auth, async (req, res) => {
    try {
        const stats = await AnalyticsService.getVideoStats(req.params.id);
        
        if (!stats) {
            return res.status(404).json({ message: 'Vídeo não encontrado' });
        }

        res.json(stats);
    } catch (error) {
        console.error('Erro ao obter estatísticas:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

module.exports = router;