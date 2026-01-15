const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.',
                error: 'UNAUTHORIZED',
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role(s): ${allowedRoles.join(' or ')}. Your role: ${req.user.role}`,
                error: 'FORBIDDEN',
            });
        }

        next();
    };
};

const ROLES = {
    USER: 'USER',
    ADMIN: 'ADMIN',
};

const adminOnly = authorize(ROLES.ADMIN);

const authenticated = authorize(ROLES.USER, ROLES.ADMIN);

module.exports = {
    authorize,
    adminOnly,
    authenticated,
    ROLES,
};
