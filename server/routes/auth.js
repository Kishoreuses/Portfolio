const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log('Login attempt with non-existent email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      console.log('Login attempt with incorrect password for email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: '8h' });
    console.log('Login successful for:', email);
    res.json({ token, admin: { username: admin.username, email: admin.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Get current admin info (requires authentication)
router.get('/me', auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json({ username: admin.username, email: admin.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get admin password info (for display purposes - returns masked password)
router.get('/password-info', auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    // Return masked password (since actual password is hashed, we show a masked representation)
    const passwordLength = admin.password ? 8 : 0; // Show 8 dots as placeholder
    res.json({ 
      hasPassword: !!admin.password,
      passwordMasked: '•'.repeat(passwordLength)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Change password route (requires authentication)
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Verify current password
    const valid = await bcrypt.compare(currentPassword, admin.password);
    if (!valid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.user.id,
      { password: hashedPassword },
      { new: true, runValidators: true }
    );

    if (!updatedAdmin) {
      console.error('Failed to update password: Admin not found after update');
      return res.status(500).json({ error: 'Failed to update password' });
    }

    console.log('Password updated successfully for admin:', admin.email);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

module.exports = router;


