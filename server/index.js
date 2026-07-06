const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
dotenv.config();
const connectDB = require('./config/db');
require('./config/passport');
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/books', require('./routes/bookRoutes'));
// app.use('/api/groups', require('./routes/groupRoutes'));
// app.use('/api/quiz', require('./routes/quizRoutes'));
// app.use('/api/progress', require('./routes/progressRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'Seca API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
