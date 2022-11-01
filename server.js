const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const app = express();

//Connect DB
connectDB();

app.use(
  cors({
    origin: 'http://localhost:3000'
  })
);
//Init middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('Api running'));

//Define rputes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
