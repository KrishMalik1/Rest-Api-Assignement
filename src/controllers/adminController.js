const User = require('../models/User');
const Task = require('../models/Task');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Admin
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments();
    const users = await User.find().sort('-createdAt').skip(skip).limit(Number(limit));

    return successResponse(res, 200, 'Users fetched', users, {
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PATCH /api/v1/admin/users/:id/role
// @access  Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return errorResponse(res, 400, 'Role must be user or admin.');
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) return errorResponse(res, 404, 'User not found.');
    return successResponse(res, 200, 'User role updated', user);
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate/activate user
// @route   PATCH /api/v1/admin/users/:id/status
// @access  Admin
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return errorResponse(res, 404, 'User not found.');

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    return successResponse(res, 200, `User ${user.isActive ? 'activated' : 'deactivated'}`, user);
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/v1/admin/stats
// @access  Admin
const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalTasks, tasksByStatus, tasksByPriority] = await Promise.all([
      User.countDocuments(),
      Task.countDocuments(),
      Task.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Task.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
    ]);

    return successResponse(res, 200, 'Stats fetched', {
      totalUsers,
      totalTasks,
      tasksByStatus,
      tasksByPriority,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, updateUserRole, toggleUserStatus, getStats };
