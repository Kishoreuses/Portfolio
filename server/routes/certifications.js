const express = require('express');
const router = express.Router();
const Certification = require('../models/Certification');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all certifications
router.get('/', async (req, res) => {
  try {
    const certifications = await Certification.find().sort({ order: 1 });
    res.json(certifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create certification
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = `/images/${req.file.filename}`;
    }
    const certification = new Certification(data);
    await certification.save();
    res.json(certification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update certification
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = `/images/${req.file.filename}`;
    }
    const certification = await Certification.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(certification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete certification
router.delete('/:id', auth, async (req, res) => {
  try {
    await Certification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Certification deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

