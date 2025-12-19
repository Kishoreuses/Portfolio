const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const contactUpload = require('../middleware/contactUpload');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Create nodemailer transporter for local development
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send email using Resend API (recommended for production)
const sendEmailViaResend = async (mailOptions) => {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY not configured');
  }

  // Prepare attachments for Resend API
  const resendAttachments = [];
  if (mailOptions.attachments && mailOptions.attachments.length > 0) {
    for (const attachment of mailOptions.attachments) {
      try {
        const fileContent = fs.readFileSync(attachment.path);
        const base64Content = fileContent.toString('base64');
        resendAttachments.push({
          filename: attachment.filename,
          content: base64Content
        });
      } catch (err) {
        console.error(`Failed to read attachment ${attachment.filename}:`, err);
      }
    }
  }

  const payload = {
    from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    to: [mailOptions.to],
    reply_to: mailOptions.replyTo,
    subject: mailOptions.subject,
    html: mailOptions.html
  };

  // Only add attachments if there are any
  if (resendAttachments.length > 0) {
    payload.attachments = resendAttachments;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }

  return await response.json();
};

// Submit contact form with file attachments
router.post('/', contactUpload.array('attachments', 5), async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const attachments = req.files || [];

    // Save to database
    const contactData = {
      name,
      email,
      subject,
      message,
      attachments: attachments.map(file => ({
        filename: file.originalname,
        path: file.path
      }))
    };

    const contact = new Contact(contactData);
    await contact.save();

    // Send email with attachments
    try {
      const recipientEmail = process.env.RECIPIENT_EMAIL || process.env.EMAIL_USER;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        replyTo: email,
        subject: `Portfolio Contact: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #7c5aff; border-bottom: 2px solid #7c5aff; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Subject:</strong> ${subject}</p>
            </div>
            <div style="background: #ffffff; padding: 20px; border-radius: 8px; border-left: 4px solid #7c5aff;">
              <h3 style="color: #333; margin-top: 0;">Message:</h3>
              <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
            ${attachments.length > 0 ? `
              <div style="margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 8px;">
                <strong>Attachments (${attachments.length}):</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  ${attachments.map(file => `<li>${file.originalname}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px;">
              <p>This email was sent from your portfolio contact form.</p>
              <p>Reply directly to this email to respond to ${name}.</p>
            </div>
          </div>
        `,
        attachments: attachments.map(file => ({
          filename: file.originalname,
          path: file.path
        }))
      };

      // Try Resend API first (works on Render), fallback to SMTP
      if (process.env.RESEND_API_KEY) {
        console.log('Attempting to send email via Resend API...');
        await sendEmailViaResend(mailOptions);
        console.log('Email sent successfully via Resend API');
      } else {
        console.log('Attempting to send email via SMTP (Gmail)...');
        const transporter = createTransporter();
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully via SMTP');
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Don't fail the request if email fails, just log it
    }

    res.json({ message: 'Message sent successfully!', contact });
  } catch (error) {
    // Clean up uploaded files if there's an error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    res.status(400).json({ error: error.message });
  }
});

// Get all messages (admin)
router.get('/', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;









