const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

//mongoose.connect(db)

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true //added because of deprecation warning, make note in case this causes a problem in the future, I was under the assumption all you needed was useNewURLParser
    });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.log(err.message);
    //Exit the process with failure
    process.exit();
  }
};

module.exports = connectDB;
