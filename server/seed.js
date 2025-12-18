const mongoose = require('mongoose');
require('dotenv').config();

const bcrypt = require('bcryptjs');
const Profile = require('./models/Profile');
const Skill = require('./models/Skill');
const Project = require('./models/Project');
const Certification = require('./models/Certification');
const Education = require('./models/Education');
const Interest = require('./models/Interest');
const Admin = require('./models/Admin');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  seedDatabase();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

async function seedDatabase() {
  try {
    // Clear existing data
    await Profile.deleteMany({});
    await Admin.deleteMany({});
    await Skill.deleteMany({});
    await Project.deleteMany({});
    await Certification.deleteMany({});
    await Education.deleteMany({});
    await Interest.deleteMany({});

    // Seed Admin (configurable via env)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPlain = process.env.ADMIN_PASSWORD || 'admin123';
    const adminPassword = await bcrypt.hash(adminPlain, 10);

    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      existingAdmin.username = adminUsername;
      existingAdmin.password = adminPassword;
      await existingAdmin.save();
    } else {
      await Admin.create({
        username: adminUsername,
        email: adminEmail,
        password: adminPassword,
      });
    }

    // Seed Profile
    const profile = new Profile({
      name: 'Kishore S',
      title: 'Full-Stack & Mobile Developer',
      subtitle: 'Full-Stack & Mobile Developer crafting performant, accessible, and visually clean web and Flutter applications.',
      email: 'kishoreuses@gmail.com',
      phone: '+91 96778 71881',
      github: 'https://github.com/Kishoreuses',
      linkedin: 'http://www.linkedin.com/in/kishoreuses',
      photo: process.env.REACT_APP_IMAGE_BASE_URL 
        ? `${process.env.REACT_APP_IMAGE_BASE_URL}/images/WhatsApp Image 2025-09-09 at 18.53.37_49bab88f.jpg`
        : '/images/WhatsApp Image 2025-09-09 at 18.53.37_49bab88f.jpg',
      location: 'Erode, India',
      education: 'M.Sc. Software Systems (pursuing)',
      focus: 'Full-Stack Web & Mobile (Flutter)',
      about: {
        paragraph1: "I'm Kishore S, an M.Sc. Software Systems candidate (CGPA 8.55) who loves pairing clean UX with reliable engineering. I've shipped mobile and web experiences that solve real problems—whether it's logistics apps like Earth Movers, mentorship platforms like Mentor Connect, or AI-assisted learning tools like PyEval AI.",
        paragraph2: "I'm strongest in full-stack web and Flutter, with solid grounding in Java/OOP, databases (MongoDB/SQL), and cloud backends (Firebase). I care about readable code, smooth interactions, and accessibility so products stay performant and inclusive."
      }
    });
    await profile.save();

    // Seed Skills
    const skills = [
      { name: 'HTML / CSS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', order: 1 },
      { name: 'JavaScript (ES6+)', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', order: 2 },
      { name: 'Flutter / Dart', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg', order: 3 },
      { name: 'Java / OOP', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', order: 4 },
      { name: 'MongoDB / SQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', order: 5 },
      { name: 'Git / GitHub', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', order: 6 },
      { name: 'UI/UX · Figma', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg', order: 7 },
      { name: 'Firebase', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg', order: 8 }
    ];
    await Skill.insertMany(skills);

    // Seed Projects
    const projects = [
      {
        title: 'Earth Movers',
        description: 'Mobile app for booking construction materials and renting vehicles (JCB, tractors, lorries) for delivery and on-demand use.',
        tags: ['Flutter', 'Firebase', 'Maps'],
        codeLink: 'https://github.com/Kishoreuses/EarthMovers-APP-Consutancy',
        order: 1
      },
      {
        title: 'Mentor Connect',
        description: 'Mobile platform connecting mentors (industry, academia) with mentees for training, career guidance, and skill growth.',
        tags: ['Flutter', 'Firebase', 'Notifications'],
        codeLink: 'https://github.com/Kishoreuses/SIH-Mentor-Connect-PID1630',
        order: 2
      },
      {
        title: 'BikeHouse',
        description: 'Full-stack platform for buying and selling second-hand bikes, similar to OLX, with listings and user flows.',
        tags: ['Full-Stack', 'CRUD', 'Auth'],
        codeLink: 'https://github.com/Kishoreuses/FULLSTACK-BIKEHOUSE',
        order: 3
      },
      {
        title: 'PyEval AI',
        description: 'Web portal for training and testing Python programs with AI feedback, class management, and assignment workflows.',
        tags: ['Full-Stack', 'AI Feedback', 'Classroom'],
        order: 4
      }
    ];
    await Project.insertMany(projects);

    // Seed Certifications
    const certifications = [
      {
        title: 'Oracle Certified Generative AI Professional',
        issuer: 'Oracle Corporation',
        year: '2025',
        image: process.env.REACT_APP_IMAGE_BASE_URL 
          ? `${process.env.REACT_APP_IMAGE_BASE_URL}/images/Oracle Cloud Infrastructure Gen AI_page1.jpg`
          : '/images/Oracle Cloud Infrastructure Gen AI_page1.jpg',
        order: 1
      },
      {
        title: 'Oracle APEX Cloud Developer',
        issuer: 'Oracle Corporation',
        year: '2025',
        image: process.env.REACT_APP_IMAGE_BASE_URL 
          ? `${process.env.REACT_APP_IMAGE_BASE_URL}/images/Oracle Apex Cloud_page1.jpg`
          : '/images/Oracle Apex Cloud_page1.jpg',
        order: 2
      },
      {
        title: 'Fundamentals of Deep Learning',
        issuer: 'NVIDIA DLI',
        year: '2025',
        image: process.env.REACT_APP_IMAGE_BASE_URL 
          ? `${process.env.REACT_APP_IMAGE_BASE_URL}/images/Fundamentals of Deep Learning_page1.jpg`
          : '/images/Fundamentals of Deep Learning_page1.jpg',
        order: 3
      }
    ];
    await Certification.insertMany(certifications);

    // Seed Education
    const education = [
      {
        degree: 'M.Sc. Software Systems (pursuing)',
        institution: 'Kongu Engineering College, Perundurai',
        period: 'CGPA 8.55 (till 6th sem)',
        description: 'Focus: Full-stack, mobile development, OOP, Java, databases.',
        logo: 'https://upload.wikimedia.org/wikipedia/en/2/25/Kongu_Engineering_College_logo.png',
        order: 1
      },
      {
        degree: 'SSLC (2020)',
        institution: 'Nandhi Matric. Higher Secondary School, Erode',
        period: '86.6%',
        description: 'Built foundations in math, logic, and problem solving.',
        logo: 'https://img.icons8.com/color/96/school.png',
        order: 2
      }
    ];
    await Education.insertMany(education);

    // Seed Interests
    const interests = [
      {
        title: 'Full-Stack Web Development',
        description: 'Designing and shipping end-to-end experiences that blend performant backends with polished UI.',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
        projects: ['PyEval AI — AI feedback portal', 'BikeHouse — full-stack listings'],
        order: 1
      },
      {
        title: 'Mobile App Development (Flutter)',
        description: 'Crafting delightful cross-platform apps with Flutter, Firebase, and thoughtful UX.',
        image: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=800&q=80',
        projects: ['Earth Movers — logistics app', 'Mentor Connect — mentorship app'],
        order: 2
      },
      {
        title: 'Object-Oriented & Core Java',
        description: 'Building scalable solutions with strong OOP fundamentals and Java ecosystems.',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        projects: ['Bike Inventory — JDBC mini', 'Core Java labs & OOP patterns'],
        order: 3
      }
    ];
    await Interest.insertMany(interests);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

