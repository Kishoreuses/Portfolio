const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');
const uploadResume = require('../middleware/uploadResume');
const fs = require('fs');
const path = require('path');

// Get the latest resume
router.get('/', async (req, res) => {
    try {
        // Find the most recent resume
        const resume = await Resume.findOne().sort({ createdAt: -1 });
        if (!resume) {
            return res.status(404).json({ message: 'No resume found' });
        }
        res.json(resume);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Download/View resume file directly (optional helper, or frontend can use /uploads/filename)
router.get('/download', async (req, res) => {
    try {
        const resume = await Resume.findOne().sort({ createdAt: -1 });
        if (!resume) {
            return res.status(404).send('No resume found');
        }
        // Construct absolute path. Note: database stores relative path usually or filename.
        // Our middleware stored it in ../../uploads.
        // The model stores 'path' which we set below.
        const uploadsDir = path.join(__dirname, '../../uploads');
        const filePath = path.join(uploadsDir, resume.filename);

        if (fs.existsSync(filePath)) {
            // Set headers to view inline (browser handles PDF)
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${resume.originalName || 'resume.pdf'}"`);
            res.sendFile(filePath);
        } else {
            res.status(404).send('File not found on server');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// Upload resume
router.post('/', auth, uploadResume.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a PDF file' });
        }

        // Optional: Delete old resumes if we only want one? 
        // User said "upload and delete resume", implying management. 
        // But usually a portfolio has ONE resume. Let's keep it simple: generic upload. 
        // If we want to replace, we can do it here. Let's append for history or replace?
        // Let's just add new one. Front end will pick the latest.

        const resume = new Resume({
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: `/uploads/${req.file.filename}`, // Web accessible path
            size: req.file.size,
            mimeType: req.file.mimetype
        });

        await resume.save();
        res.json(resume);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete resume
router.delete('/:id', auth, async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }

        // Delete file from filesystem
        const uploadsDir = path.join(__dirname, '../../uploads');
        const filePath = path.join(uploadsDir, resume.filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await Resume.findByIdAndDelete(req.params.id);
        res.json({ message: 'Resume deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
