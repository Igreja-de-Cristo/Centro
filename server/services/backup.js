const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const winston = require('winston');
const { google } = require('googleapis');

// Modelos
const Video = require('../models/Video');
const Playlist = require('../models/Playlist');

// Configuração do logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ 
            filename: path.join(__dirname, '../logs/backup.log')
        })
    ]
});

// Configuração do Google Drive
const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, '../config/google-credentials.json'),
    scopes: ['https://www.googleapis.com/auth/drive.file']
});

const drive = google.drive({ version: 'v3', auth });

class BackupService {
    constructor() {
        this.backupPath = path.join(__dirname, '../backups');
        if (!fs.existsSync(this.backupPath)) {
            fs.mkdirSync(this.backupPath, { recursive: true });
        }
    }

    async createBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `backup-${timestamp}.json`;
        const filepath = path.join(this.backupPath, filename);

        try {
            // Buscar todos os dados
            const videos = await Video.find();
            const playlists = await Playlist.find();

            const backupData = {
                timestamp,
                videos,
                playlists,
                metadata: {
                    totalVideos: videos.length,
                    totalPlaylists: playlists.length,
                    version: process.env.npm_package_version
                }
            };

            // Salvar localmente
            fs.writeFileSync(
                filepath, 
                JSON.stringify(backupData, null, 2)
            );

            // Upload para Google Drive
            if (process.env.ENABLE_DRIVE_BACKUP === 'true') {
                await this.uploadToDrive(filepath, filename);
            }

            // Limpar backups antigos
            await this.cleanOldBackups();

            logger.info(`Backup criado com sucesso: ${filename}`);
            return { success: true, filename };

        } catch (error) {
            logger.error('Erro ao criar backup:', error);
            throw error;
        }
    }

    async uploadToDrive(filepath, filename) {
        try {
            const fileMetadata = {
                name: filename,
                parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
            };

            const media = {
                mimeType: 'application/json',
                body: fs.createReadStream(filepath)
            };

            const response = await drive.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id'
            });

            logger.info(`Backup enviado para o Google Drive: ${response.data.id}`);
            return response.data.id;

        } catch (error) {
            logger.error('Erro ao fazer upload para o Google Drive:', error);
            throw error;
        }
    }

    async cleanOldBackups() {
        try {
            const files = fs.readdirSync(this.backupPath);
            const maxBackups = process.env.MAX_BACKUPS || 7;

            if (files.length > maxBackups) {
                files
                    .map(file => ({
                        name: file,
                        time: fs.statSync(path.join(this.backupPath, file)).mtime.getTime()
                    }))
                    .sort((a, b) => a.time - b.time)
                    .slice(0, files.length - maxBackups)
                    .forEach(file => {
                        fs.unlinkSync(path.join(this.backupPath, file.name));
                        logger.info(`Backup antigo removido: ${file.name}`);
                    });
            }
        } catch (error) {
            logger.error('Erro ao limpar backups antigos:', error);
            throw error;
        }
    }

    async restoreBackup(filename) {
        try {
            const filepath = path.join(this.backupPath, filename);
            const backupData = JSON.parse(fs.readFileSync(filepath));

            // Validar dados do backup
            if (!backupData.videos || !backupData.playlists) {
                throw new Error('Arquivo de backup inválido');
            }

            // Limpar coleções existentes
            await Video.deleteMany({});
            await Playlist.deleteMany({});

            // Restaurar dados
            await Video.insertMany(backupData.videos);
            await Playlist.insertMany(backupData.playlists);

            logger.info(`Backup restaurado com sucesso: ${filename}`);
            return { success: true, message: 'Backup restaurado com sucesso' };

        } catch (error) {
            logger.error('Erro ao restaurar backup:', error);
            throw error;
        }
    }
}

// Instanciar serviço
const backupService = new BackupService();

// Agendar backup diário às 03:00
cron.schedule('0 3 * * *', async () => {
    try {
        await backupService.createBackup();
    } catch (error) {
        logger.error('Erro no backup agendado:', error);
    }
});

module.exports = backupService;