const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  github: { type: String, required: true },
  linkedin: { type: String, required: true },
  photo: { type: String, required: true },
  location: { type: String, required: true },
  education: { type: String, required: true },
  focus: { type: String, required: true },
  about: {
    paragraph1: { type: String, required: true },
    paragraph2: { type: String, required: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);















