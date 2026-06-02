const Task = require('../models/Task');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get all tasks (admin: all; user: own)
// @route   GET /api/v1/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const filter = {};
    if (req.user.role !== 'admin') filter.owner = req.user._id;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .populate('owner', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    return successResponse(res, 200, 'Tasks fetched', tasks, {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/v1/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('owner', 'name email');

    if (!task) return errorResponse(res, 404, 'Task not found.');

    // Users can only view their own tasks
    if (req.user.role !== 'admin' && task.owner._id.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Not authorized to view this task.');
    }

    return successResponse(res, 200, 'Task fetched', task);
  } catch (error) {
    next(error);
  }
};

// @desc    Create task
// @route   POST /api/v1/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      owner: req.user._id,
    });

    return successResponse(res, 201, 'Task created', task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/v1/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return errorResponse(res, 404, 'Task not found.');

    if (req.user.role !== 'admin' && task.owner.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Not authorized to update this task.');
    }

    const allowed = ['title', 'description', 'status', 'priority', 'dueDate'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });

    await task.save();
    return successResponse(res, 200, 'Task updated', task);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return errorResponse(res, 404, 'Task not found.');

    if (req.user.role !== 'admin' && task.owner.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Not authorized to delete this task.');
    }

    await task.deleteOne();
    return successResponse(res, 200, 'Task deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
