const mongoose = require("mongoose");

  const DB_URI = 'mongodb://127.0.0.1:27017/innvo';
  const DB_URI_ATLAS = 'mongodb+srv://immanasp:4BOeWl5tPcoF6YQ8@cluster0.9gkisrs.mongodb.net/innvo?retryWrites=true&w=majority';
	const DB_USER = '';
	const DB_PASSWORD	=	'';

const connentDB = async () => {
  try {
    const conn = await mongoose.connect(DB_URI_ATLAS, { useNewUrlParser: true, useUnifiedTopology: true});
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Failed to connect to the server", error);
  }
};

module.exports = connentDB;
