const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
  }
};

module.exports = connectDB;
