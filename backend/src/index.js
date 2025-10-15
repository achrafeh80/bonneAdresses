// src/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authMiddleware = require('./middleware/auth.middleware');

// routes
const userRoutes = require('./routes/user.routes');
const addressRoutes = require('./routes/address.routes');
const commentRoutes = require('./routes/comment.routes');
const imageRoutes = require('./routes/image.routes');

const app = express();
app.use(cors());
app.use(express.json());

// Middleware global pour vérifier token Firebase
app.use(authMiddleware);

// API routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/addresses', addressRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/images', imageRoutes);

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

// Port et fonction de démarrage avec fallback automatique
const PORT = parseInt(process.env.PORT) || 3000;

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is already in use, trying port ${port + 1}...`);
      startServer(port + 1); // essaye le port suivant
    } else {
      console.error('Server error:', err);
    }
  });
}

// Connexion MongoDB puis démarrage serveur
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    startServer(PORT);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
