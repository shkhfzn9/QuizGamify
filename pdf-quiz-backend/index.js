require('dotenv').config();
const express = require('express');
const cors = require('cors');
const quizRoutes = require('./routes/quiz.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/quiz', quizRoutes);

// Health check
app.get('/', (req, res) => res.send('PDF to Quiz API is running'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server error');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));