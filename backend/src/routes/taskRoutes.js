const express = require('express');
const {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
} = require('../controllers/taskController');
const { authenticate } = require('../middleware/auth');
const { authorize, ROLES } = require('../middleware/rbac');
const { validate } = require('../middleware/validate');
const { taskValidators } = require('../utils/validators');

const router = express.Router();

router.use(authenticate);

router.get('/', taskValidators.list, validate, getAllTasks);
router.get('/:id', taskValidators.getById, validate, getTaskById);
router.post('/', authorize(ROLES.ADMIN), taskValidators.create, validate, createTask);
router.put('/:id', authorize(ROLES.ADMIN), taskValidators.update, validate, updateTask);
router.delete('/:id', authorize(ROLES.ADMIN), taskValidators.delete, validate, deleteTask);

module.exports = router;
