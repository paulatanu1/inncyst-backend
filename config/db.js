const mongoose = require("mongoose");

  const DB_URI = 'mongodb://127.0.0.1:27017/innvo';
	const DB_USER = '';
	const DB_PASSWORD	=	'';

// const uri = `mongodb+srv://manaspramanik:Manas_1999@cluster0.vpytl.mongodb.net/projectP?retryWrites=true&w=majority`;
const connentDB = async () => {
  try {
    const conn = await mongoose.connect(DB_URI, { useNewUrlParser: true, user: DB_USER, pass: DB_PASSWORD });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Failed to connect to the server", error);
  }
};

module.exports = connentDB;
