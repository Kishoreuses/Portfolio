const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const auth = require('../middleware/auth');

// Get profile
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    res.json(profile || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update profile
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// Create or update profile
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    let profileData = { ...req.body };
    // Parse nested object manually if sent as form-data strings
    if (profileData.about && typeof profileData.about === 'string') {
      try {
        profileData.about = JSON.parse(profileData.about);
      } catch (e) {
        // keep as is if not json
      }
    }

    // Handle Image Upload
    if (req.file) {
      profileData.photo = `/uploads/${req.file.filename}`;
    }

    let profile = await Profile.findOne();

    // Handle Photo Deletion
    if (req.body.deletePhoto === 'true' || req.body.deletePhoto === true) {
      if (profile && profile.photo) {
        const oldPath = path.join(__dirname, '../../uploads', path.basename(profile.photo));
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      profileData.photo = '';
    } else if (req.file && profile && profile.photo) {
      // If uploading new photo, delete old one
      const oldPath = path.join(__dirname, '../../uploads', path.basename(profile.photo));
      if (fs.existsSync(oldPath) && profile.photo.startsWith('/uploads/')) {
        fs.unlinkSync(oldPath);
      }
    }

    if (profile) {
      profile = await Profile.findOneAndUpdate({}, profileData, { new: true });
    } else {
      profile = new Profile(profileData);
      await profile.save();
    }
    res.json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

