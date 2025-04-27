const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_LINK);
        console.log("Database Connected !");
    } catch (e) {
        console.log(e.message);
        process.exit(1);
    }
}

module.exports = connectDB;