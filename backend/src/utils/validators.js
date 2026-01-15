const { body, param, query } = require('express-validator');

const authValidators = {
    register: [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Name is required')
            .isLength({ min: 2, max: 50 })
            .withMessage('Name must be between 2 and 50 characters')
            .escape(),

        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Please provide a valid email')
            .normalizeEmail(),

        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters')
            .matches(/\d/)
            .withMessage('Password must contain at least one number'),

        body('role')
            .optional()
            .isIn(['USER', 'ADMIN'])
            .withMessage('Role must be either USER or ADMIN'),
    ],

    login: [
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Please provide a valid email')
            .normalizeEmail(),

        body('password')
            .notEmpty()
            .withMessage('Password is required'),
    ],
};

const taskValidators = {
    create: [
        body('title')
            .trim()
            .notEmpty()
            .withMessage('Title is required')
            .isLength({ min: 3, max: 100 })
            .withMessage('Title must be between 3 and 100 characters')
            .escape(),

        body('description')
            .optional()
            .trim()
            .isLength({ max: 500 })
            .withMessage('Description cannot exceed 500 characters')
            .escape(),

        body('status')
            .optional()
            .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
            .withMessage('Status must be PENDING, IN_PROGRESS, or COMPLETED'),

        body('priority')
            .optional()
            .isIn(['LOW', 'MEDIUM', 'HIGH'])
            .withMessage('Priority must be LOW, MEDIUM, or HIGH'),
    ],

    update: [
        param('id')
            .isMongoId()
            .withMessage('Invalid task ID'),

        body('title')
            .optional()
            .trim()
            .isLength({ min: 3, max: 100 })
            .withMessage('Title must be between 3 and 100 characters')
            .escape(),

        body('description')
            .optional()
            .trim()
            .isLength({ max: 500 })
            .withMessage('Description cannot exceed 500 characters')
            .escape(),

        body('status')
            .optional()
            .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
            .withMessage('Status must be PENDING, IN_PROGRESS, or COMPLETED'),

        body('priority')
            .optional()
            .isIn(['LOW', 'MEDIUM', 'HIGH'])
            .withMessage('Priority must be LOW, MEDIUM, or HIGH'),
    ],

    getById: [
        param('id')
            .isMongoId()
            .withMessage('Invalid task ID'),
    ],

    delete: [
        param('id')
            .isMongoId()
            .withMessage('Invalid task ID'),
    ],

    list: [
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer'),

        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100'),

        query('status')
            .optional()
            .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
            .withMessage('Status must be PENDING, IN_PROGRESS, or COMPLETED'),
    ],
};

module.exports = {
    authValidators,
    taskValidators,
};
