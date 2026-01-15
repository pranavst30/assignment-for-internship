const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.',
                error: 'UNAUTHORIZED',
            });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. Invalid token format.',
                error: 'UNAUTHORIZED',
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token:', decoded);

            const user = await User.findById(decoded.userId);
            console.log('Found user:', user);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found. Token may be invalid.',
                    error: 'UNAUTHORIZED',
                });
            }

            req.user = {
                userId: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            };

            next();
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token has expired. Please login again.',
                    error: 'TOKEN_EXPIRED',
                });
            }

            if (jwtError.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token.',
                    error: 'INVALID_TOKEN',
                });
            }

            throw jwtError;
        }
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during authentication.',
            error: 'SERVER_ERROR',
        });
    }
};

module.exports = { authenticate };
