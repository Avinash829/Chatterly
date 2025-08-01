const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MONGO_DB connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.log(`Mongo_DB Connection Error: ${error.message}`);
        process.exit();
    }
};

module.exports = connectDB;