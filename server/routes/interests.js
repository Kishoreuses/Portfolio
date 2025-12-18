const express = require('express');
const router = express.Router();
const Interest = require('../models/Interest');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all interests
router.get('/', async (req, res) => {
  try {
    const interests = await Interest.find().sort({ order: 1 });
    res.json(interests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create interest
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = `/images/${req.file.filename}`;
    }
    if (data.projects && typeof data.projects === 'string') {
      data.projects = data.projects.split(',').map(p => p.trim()).filter(Boolean);
    }
    const interest = new Interest(data);
    await interest.save();
    res.json(interest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update interest
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = `/images/${req.file.filename}`;
    }
    if (data.projects && typeof data.projects === 'string') {
      data.projects = data.projects.split(',').map(p => p.trim()).filter(Boolean);
    }
    const interest = await Interest.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(interest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete interest
router.delete('/:id', auth, async (req, res) => {
  try {
    await Interest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Interest deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

