const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

dotenv.config();

// Init Server
const app = express();

// Connect to DB
const db = process.env.DB_CONNECT;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
  console.log('Connected to MongoDB...')
);

// Import Routes
const usersRoute = require('./routes/users');
// Example Privare Route
const postRoute = require('./routes/posts');

// Middleware
app.use(express.json());

// Route Middleware
app.use('/api/user', usersRoute);
app.use('/api/posts', postRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
