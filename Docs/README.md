# Kishore Portfolio - React + MongoDB

A dynamic portfolio website built with React.js frontend and MongoDB backend.

## Features

- **Dynamic Content**: All portfolio data stored in MongoDB
- **React Components**: Modular, reusable React components
- **RESTful API**: Express.js backend with MongoDB
- **Responsive Design**: Modern, gradient-based UI
- **Smooth Animations**: CSS animations and transitions
- **Auto-scrolling Carousels**: Skills and certifications with infinite scroll

## Tech Stack

### Frontend
- React 18
- Axios for API calls
- CSS3 with custom properties

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS enabled

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Setup

1. **Install dependencies:**
```bash
npm run install-all
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your MongoDB URI
# Example: MONGODB_URI=mongodb://localhost:27017/portfolio
# Or use MongoDB Atlas: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/portfolio
```

3. **Copy images:**
   - Ensure your `images` folder (with certificates and profile photo) is in the root directory
   - Images should be accessible at `/images/...` path

4. **Seed the database (first time only):**
```bash
npm run seed
```

5. **Start development servers:**
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- React app on `http://localhost:3000`

## Project Structure

```
portfolio/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API service
│   │   ├── styles/        # CSS files
│   │   └── App.js
│   └── package.json
├── server/                 # Express backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── index.js
└── package.json
```

## API Endpoints

- `GET /api/profile` - Get profile data
- `POST /api/profile` - Create/update profile
- `GET /api/skills` - Get all skills
- `GET /api/projects` - Get all projects
- `GET /api/certifications` - Get all certifications
- `GET /api/education` - Get education entries
- `GET /api/interests` - Get interests
- `POST /api/contact` - Submit contact form

## Database Models

- Profile
- Skill
- Project
- Certification
- Education
- Interest
- Contact

## Initial Data Setup

1. **Copy images folder:**
   - Make sure your `images` folder (with certificate images and profile photo) is in the root directory
   - The backend serves images from `/images` route

2. **Seed the database:**
```bash
npm run seed
```

This will populate the database with:
- Profile information
- Skills
- Projects
- Certifications
- Education entries
- Interests

**Note:** Update the image paths in `server/seed.js` if your images are in a different location.

## Production Build

```bash
cd client
npm run build
```

The build folder will contain the production-ready React app.

## License

MIT

