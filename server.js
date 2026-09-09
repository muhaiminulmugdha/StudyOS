const express = require('express');
const cors = require('cors');
const path = require('path');
const studyRoutes = require('./routes/studyRoutes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set View Engine
app.set('view engine', 'ejs');

// Mount Routes
app.use('/', studyRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`StudyOS server running on http://localhost:${PORT}`);
});