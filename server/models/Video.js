const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    youtubeId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    customTitle: String,
    description: String,
    category: {
        type: String,
        enum: ['culto', 'estudo', 'evento'],
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    publishedAt: {
        type: Date,
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    },
    analytics: {
        views: {
            type: Number,
            default: 0
        },
        lastViewed: Date,
        viewsHistory: [{
            date: Date,
            count: Number
        }],
        engagementScore: {
            type: Number,
            default: 0
        }
    },
    playlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playlist'
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'scheduled'],
        default: 'active'
    },
    metadata: {
        duration: String,
        thumbnails: {
            default: String,
            medium: String,
            high: String
        },
        tags: [String]
    }
}, {
    timestamps: true
});

// Índices para melhor performance
videoSchema.index({ youtubeId: 1 });
videoSchema.index({ category: 1 });
videoSchema.index({ featured: 1 });
videoSchema.index({ 'analytics.views': -1 });

// Métodos do modelo
videoSchema.methods.incrementViews = async function() {
    this.analytics.views += 1;
    this.analytics.lastViewed = new Date();
    this.analytics.viewsHistory.push({
        date: new Date(),
        count: 1
    });
    await this.save();
};

videoSchema.methods.updateEngagementScore = function() {
    const now = new Date();
    const daysSinceAdded = (now - this.addedAt) / (1000 * 60 * 60 * 24);
    this.analytics.engagementScore = (this.analytics.views / (daysSinceAdded + 1)) * 10;
};

// Middleware para atualizar engagementScore antes de salvar
videoSchema.pre('save', function(next) {
    this.updateEngagementScore();
    next();
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;