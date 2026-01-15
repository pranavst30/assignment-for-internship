const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');

const register = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, 'User with this email already exists', 'EMAIL_EXISTS');
    }

    const user = await User.create({
        name,
        email,
        password,
        role: role || 'USER',
    });

    const token = generateToken(user._id);

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
            },
            token,
        },
    });
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findByEmailWithPassword(email);

    if (!user) {
        throw new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const token = generateToken(user._id);

    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        },
    });
});

const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.userId);

    if (!user) {
        throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');
    }

    res.status(200).json({
        success: true,
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
            },
        },
    });
});

const generateToken = (userId) => {
    console.log('Generating token for userId:', userId);
    const token = jwt.sign(
        { userId: userId.toString() },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
    console.log('Generated token payload test:', jwt.decode(token));
    return token;
};

module.exports = {
    register,
    login,
    getMe,
};
