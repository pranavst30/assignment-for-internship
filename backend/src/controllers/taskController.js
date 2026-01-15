const Task = require('../models/Task');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');

const createTask = asyncHandler(async (req, res) => {
    const { title, description, status, priority } = req.body;

    const task = await Task.create({
        title,
        description,
        status,
        priority,
        createdBy: req.user.userId,
    });

    await task.populate('createdBy', 'name email');

    res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: { task },
    });
});

const getAllTasks = asyncHandler(async (req, res) => {
    const { page, limit, status } = req.query;

    const query = {};
    if (status) {
        query.status = status;
    }

    const result = await Task.paginate(query, { page, limit });

    res.status(200).json({
        success: true,
        message: 'Tasks retrieved successfully',
        data: result,
    });
});

const getTaskById = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id).populate('createdBy', 'name email');

    if (!task) {
        throw new ApiError(404, 'Task not found', 'TASK_NOT_FOUND');
    }

    res.status(200).json({
        success: true,
        message: 'Task retrieved successfully',
        data: { task },
    });
});

const updateTask = asyncHandler(async (req, res) => {
    const { title, description, status, priority } = req.body;

    let task = await Task.findById(req.params.id);

    if (!task) {
        throw new ApiError(404, 'Task not found', 'TASK_NOT_FOUND');
    }

    task = await Task.findByIdAndUpdate(
        req.params.id,
        { title, description, status, priority },
        { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: { task },
    });
});

const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        throw new ApiError(404, 'Task not found', 'TASK_NOT_FOUND');
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
        data: null,
    });
});

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
};
