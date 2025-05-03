
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { upload, cloudinary } = require('../config/cloudinary');
const Item = require('../models/Item');
const User = require('../models/User'); // Needed for populating user info
const mongoose = require('mongoose');


// @route   POST api/items
// @desc    Report a new lost or found item
// @access  Private
router.post('/', authMiddleware, upload.single('image'), async (req, res, next) => {
  const { type, title, description, location, dateLostOrFound, lat, lng } = req.body;
  const userId = req.user.id;

  try {
    // Basic validation
    if (!type || !title || !description || !location || !dateLostOrFound) {
      // If upload happened before validation failure, delete the file
       if (req.file) {
          await cloudinary.uploader.destroy(req.file.filename); // filename is public_id
       }
      return res.status(400).json({ msg: 'Please provide all required fields (type, title, description, location, date)' });
    }

    const newItemData = {
      user: userId,
      type,
      title,
      description,
      location,
      dateLostOrFound: new Date(dateLostOrFound), // Ensure it's a Date object
    };

    // Add image URL if uploaded
    if (req.file) {
      newItemData.imageUrl = req.file.path; // URL from Cloudinary
      newItemData.imagePublicId = req.file.filename; // Public ID for deletion
    }

    // Add coordinates if provided (consider adding geoPoint later)
    // if (lat && lng) {
    //   newItemData.geoPoint = { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] };
    // }

    const newItem = new Item(newItemData);
    const savedItem = await newItem.save();

    // Populate user info before sending back
     const itemToSend = await Item.findById(savedItem._id).populate('user', 'displayName email photoURL');


    res.status(201).json(itemToSend); // Respond with the created item (populated)

  } catch (err) {
     console.error('Error reporting item:', err);
     // If error occurred after upload, attempt to delete the uploaded file
     if (req.file) {
       try {
         await cloudinary.uploader.destroy(req.file.filename);
       } catch (deleteErr) {
         console.error('Failed to delete uploaded image after error:', deleteErr);
       }
     }
     next(err); // Pass to error handler
  }
});

// @route   GET api/items
// @desc    Get all items with filtering and pagination
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { keyword, type, location, date, sortBy = 'createdAt', order = 'desc', page = 1, limit = 12, userId } = req.query;

    const query = {};

    if (keyword) {
        // Case-insensitive search on indexed fields
        query.$text = { $search: keyword };
    }
    if (type && ['lost', 'found'].includes(type)) {
      query.type = type;
    }
    if (location) {
      // Case-insensitive partial match for location text
      query.location = { $regex: location, $options: 'i' };
    }
    if (date) {
      // Filter by items reported ON a specific date (start and end of day)
       const startDate = new Date(date);
       startDate.setUTCHours(0, 0, 0, 0);
       const endDate = new Date(date);
       endDate.setUTCHours(23, 59, 59, 999);
       query.dateLostOrFound = { $gte: startDate, $lte: endDate };
    }
    if (userId) {
       // Filter by a specific user's items (for dashboard)
       if (!mongoose.Types.ObjectId.isValid(userId)) {
           return res.status(400).json({ msg: 'Invalid user ID format' });
       }
       query.user = userId;
    }

    // TODO: Proximity search needs coordinates (lat, lng) and geoPoint schema field
    // if (lat && lng && proximity) {
    //   const radius = parseFloat(proximity) / 6378.1; // Convert km to radians for MongoDB
    //   query.geoPoint = {
    //     $geoWithin: { $centerSphere: [[parseFloat(lng), parseFloat(lat)], radius] }
    //   };
    // }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Define valid sort fields and orders
    const validSortFields = ['createdAt', 'dateLostOrFound', 'title'];
    const validOrders = ['asc', 'desc'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = validOrders.includes(order) ? order : 'desc';
    const sortOptions = { [sortField]: sortOrder === 'desc' ? -1 : 1 };


    const items = await Item.find(query)
                            .populate('user', 'displayName email photoURL') // Populate user details
                            .sort(sortOptions)
                            .skip(skip)
                            .limit(limitNum);

    const totalItems = await Item.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limitNum);

    res.json({
      items,
      currentPage: pageNum,
      totalPages,
      totalItems,
    });

  } catch (err) {
    console.error('Error fetching items:', err);
    next(err);
  }
});


// @route   GET api/items/:id
// @desc    Get a single item by ID
// @access  Public
router.get('/:id', async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ msg: 'Invalid item ID format' });
        }

        const item = await Item.findById(req.params.id).populate('user', 'displayName email photoURL');

        if (!item) {
            return res.status(404).json({ msg: 'Item not found' });
        }
        res.json(item);
    } catch (err) {
        console.error('Error fetching single item:', err);
        next(err);
    }
});


// @route   PUT api/items/:id
// @desc    Update an item
// @access  Private (only owner can update)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res, next) => {
    const { type, title, description, location, dateLostOrFound } = req.body;
    const itemId = req.params.id;
    const userId = req.user.id;

    try {
        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ msg: 'Invalid item ID format' });
        }

        let item = await Item.findById(itemId);

        if (!item) {
            return res.status(404).json({ msg: 'Item not found' });
        }

        // Check if the logged-in user is the owner of the item
        if (item.user.toString() !== userId) {
            return res.status(401).json({ msg: 'User not authorized to update this item' });
        }

        const updates = {};
        if (type) updates.type = type;
        if (title) updates.title = title;
        if (description) updates.description = description;
        if (location) updates.location = location;
        if (dateLostOrFound) updates.dateLostOrFound = new Date(dateLostOrFound);

        // Handle image update
        if (req.file) {
            // Delete old image from Cloudinary if it exists
            if (item.imagePublicId) {
                try {
                    await cloudinary.uploader.destroy(item.imagePublicId);
                } catch (cloudinaryErr) {
                    console.error('Failed to delete old item image from Cloudinary during update:', cloudinaryErr);
                    // Proceed with update, but log the error
                }
            }
            updates.imageUrl = req.file.path;
            updates.imagePublicId = req.file.filename;
        }

        const updatedItem = await Item.findByIdAndUpdate(
            itemId,
            { $set: updates },
            { new: true, runValidators: true } // Return updated doc, run validations
        ).populate('user', 'displayName email photoURL');

        res.json(updatedItem);

    } catch (err) {
         console.error('Error updating item:', err);
         // If update fails after new image upload, delete the new image
         if (req.file && err) {
             try {
                 await cloudinary.uploader.destroy(req.file.filename);
             } catch (deleteErr) {
                 console.error('Failed to delete newly uploaded image after update error:', deleteErr);
             }
         }
        next(err);
    }
});

// @route   DELETE api/items/:id
// @desc    Delete an item
// @access  Private (only owner can delete)
router.delete('/:id', authMiddleware, async (req, res, next) => {
    const itemId = req.params.id;
    const userId = req.user.id;

    try {
        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ msg: 'Invalid item ID format' });
        }

        const item = await Item.findById(itemId);

        if (!item) {
            return res.status(404).json({ msg: 'Item not found' });
        }

        // Check ownership
        if (item.user.toString() !== userId) {
            return res.status(401).json({ msg: 'User not authorized to delete this item' });
        }

        // Delete image from Cloudinary if it exists
        if (item.imagePublicId) {
            try {
                await cloudinary.uploader.destroy(item.imagePublicId);
                 console.log(`Deleted image ${item.imagePublicId} from Cloudinary.`);
            } catch (cloudinaryErr) {
                console.error('Failed to delete item image from Cloudinary during item deletion:', cloudinaryErr);
                // Log error but proceed with deleting item from DB
            }
        }

        // Delete item from database
        await Item.findByIdAndDelete(itemId);

        res.json({ msg: 'Item removed successfully' });

    } catch (err) {
        console.error('Error deleting item:', err);
        next(err);
    }
});


module.exports = router;
