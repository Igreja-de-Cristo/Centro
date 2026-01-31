const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const SecurityService = require('../services/security');

// Modelo do usuário (você precisará criar este modelo)
const User = require('../models/User');

// Middleware de validação
const validateLogin = [
    check('username').trim().notEmpty().withMessage('Username é obrigatório'),
    check('password').notEmpty().withMessage('Senha é obrigatória'),
];

// Login
router.post('/login', validateLogin, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        // Verificar tentativas de login
        SecurityService.bruteForceProtection(req.ip);

        // Encontrar usuário
        const user = await User.findOne({ username });
        if (!user) {
            SecurityService.recordFailedAttempt(req.ip);
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        // Verificar senha
        const isMatch = await SecurityService.verifyPassword(password, user.password);
        if (!isMatch) {
            SecurityService.recordFailedAttempt(req.ip);
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        // Limpar tentativas falhas
        SecurityService.clearFailedAttempts(req.ip);

        // Gerar token
        const token = SecurityService.generateToken(user._id, user.role);

        // Log do evento
        SecurityService.logSecurityEvent({
            type: 'login',
            user: user.username,
            ip: req.ip
        });

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Verificar token
router.get('/verify', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const decoded = SecurityService.verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        res.json({ user });

    } catch (error) {
        console.error('Erro na verificação:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Logout (opcional - o cliente pode simplesmente descartar o token)
router.post('/logout', (req, res) => {
    // Log do evento
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
        const decoded = SecurityService.verifyToken(token);
        if (decoded) {
            SecurityService.logSecurityEvent({
                type: 'logout',
                userId: decoded.id,
                ip: req.ip
            });
        }
    }

    res.json({ message: 'Logout realizado com sucesso' });
});

module.exports = router;