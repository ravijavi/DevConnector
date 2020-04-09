const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

//Connect the database
connectDB();

//initialize middleware for body parser, express handles this, not needed to implemented manually
//init middleware
app.use(express.json({ extended: false }));

//app.get('/', (req, res) => res.send('API Running')); //Must omit if you want to deploy on the server

//make sure we can actually access the routes i.e. Define Routes
app.use('/api/users', require('./routes/api/users')); //going to make api/users pertain to '/' in the users.js file
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

//Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  //Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
