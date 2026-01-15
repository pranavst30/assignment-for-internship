const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { authValidators } = require('../utils/validators');

const router = express.Router();

router.post('/register', authValidators.register, validate, register);
router.post('/login', authValidators.login, validate, login);
router.get('/me', authenticate, getMe);

module.exports = router;
