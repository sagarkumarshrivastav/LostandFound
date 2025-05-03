
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary'); // Import only upload middleware
const itemController = require('../controllers/itemController');

// @route   POST api/items
// @desc    Report a new lost or found item
// @access  Private
router.post('/', authMiddleware, upload.single('image'), itemController.createItem);

// @route   GET api/items
// @desc    Get all items with filtering and pagination
// @access  Public
router.get('/', itemController.getAllItems);

// @route   GET api/items/:id
// @desc    Get a single item by ID
// @access  Public
router.get('/:id', itemController.getItemById);

// @route   PUT api/items/:id
// @desc    Update an item
// @access  Private (only owner can update)
router.put('/:id', authMiddleware, upload.single('image'), itemController.updateItem);

// @route   DELETE api/items/:id
// @desc    Delete an item
// @access  Private (only owner can delete)
router.delete('/:id', authMiddleware, itemController.deleteItem);

module.exports = router;
