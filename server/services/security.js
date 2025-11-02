const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'security.log' })
    ]
});

class SecurityService {
    constructor() {
        this.failedAttempts = new Map();
        this.blockedIPs = new Set();
        this.FAILED_ATTEMPT_LIMIT = 5;
        this.BLOCK_DURATION = 30 * 60 * 1000; // 30 minutos
    }

    // Gerar hash seguro para senhas
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS) || 12);
        return bcrypt.hash(password, salt);
    }

    // Verificar senha
    async verifyPassword(password, hash) {
        return bcrypt.compare(password, hash);
    }

    // Gerar token JWT
    generateToken(userId, role) {
        return jwt.sign(
            { id: userId, role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
    }

    // Verificar token JWT
    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return null;
        }
    }

    // Middleware para proteção contra brute force
    bruteForceProtection(ip) {
        if (this.blockedIPs.has(ip)) {
            throw new Error('IP bloqueado temporariamente');
        }

        const attempts = this.failedAttempts.get(ip) || 0;
        if (attempts >= this.FAILED_ATTEMPT_LIMIT) {
            this.blockedIPs.add(ip);
            setTimeout(() => this.blockedIPs.delete(ip), this.BLOCK_DURATION);
            throw new Error('Muitas tentativas falhas. IP bloqueado temporariamente');
        }
    }

    // Registrar tentativa falha
    recordFailedAttempt(ip) {
        const attempts = (this.failedAttempts.get(ip) || 0) + 1;
        this.failedAttempts.set(ip, attempts);
        
        if (attempts >= this.FAILED_ATTEMPT_LIMIT) {
            logger.warn(`IP ${ip} bloqueado por múltiplas tentativas falhas`);
        }
    }

    // Limpar tentativas falhas
    clearFailedAttempts(ip) {
        this.failedAttempts.delete(ip);
    }

    // Validar força da senha
    validatePasswordStrength(password) {
        const minLength = 12;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const errors = [];
        if (password.length < minLength) {
            errors.push(`A senha deve ter pelo menos ${minLength} caracteres`);
        }
        if (!hasUpperCase) errors.push('A senha deve conter letra maiúscula');
        if (!hasLowerCase) errors.push('A senha deve conter letra minúscula');
        if (!hasNumbers) errors.push('A senha deve conter números');
        if (!hasSpecialChars) errors.push('A senha deve conter caracteres especiais');

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Sanitizar entrada
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        return input
            .replace(/[<>]/g, '') // Remover tags HTML
            .replace(/javascript:/gi, '') // Remover javascript:
            .trim();
    }

    // Gerar hash para verificação de integridade
    generateIntegrityHash(content) {
        return crypto
            .createHash('sha256')
            .update(JSON.stringify(content))
            .digest('hex');
    }

    // Verificar integridade
    verifyIntegrity(content, hash) {
        const calculatedHash = this.generateIntegrityHash(content);
        return calculatedHash === hash;
    }

    // Limpar dados sensíveis
    sanitizeOutput(data) {
        const sensitiveFields = ['password', 'token', 'secret'];
        
        if (typeof data !== 'object' || !data) return data;

        if (Array.isArray(data)) {
            return data.map(item => this.sanitizeOutput(item));
        }

        const cleaned = { ...data };
        for (const field of sensitiveFields) {
            if (field in cleaned) {
                delete cleaned[field];
            }
        }

        return cleaned;
    }

    // Validar permissões
    checkPermission(user, requiredRole) {
        const roleHierarchy = {
            admin: 3,
            editor: 2,
            user: 1
        };

        return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
    }

    // Registrar evento de segurança
    logSecurityEvent(event) {
        logger.info('Evento de segurança:', {
            ...event,
            timestamp: new Date().toISOString()
        });
    }
}

module.exports = new SecurityService();