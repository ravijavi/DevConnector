const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect the database
connectDB();

app.get('/', (req, res) => res.send('API Running'));

//make sure we can actually access the routes i.e. Define Routes
app.use('/api/users', require('./routes/api/users')); //going to make api/users pertain to '/' in the users.js file
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.port || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
