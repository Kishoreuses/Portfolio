const express = require('express');
const router = express.Router();
const Education = require('../models/Education');
const auth = require('../middleware/auth');

// Get all education entries
router.get('/', async (req, res) => {
  try {
    const education = await Education.find().sort({ order: 1 });
    res.json(education);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create education entry
router.post('/', auth, async (req, res) => {
  try {
    const education = new Education(req.body);
    await education.save();
    res.json(education);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update education entry
router.put('/:id', auth, async (req, res) => {
  try {
    const education = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(education);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete education entry
router.delete('/:id', auth, async (req, res) => {
  try {
    await Education.findByIdAndDelete(req.params.id);
    res.json({ message: 'Education entry deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

