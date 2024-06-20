import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL);
        console.log("Database is Connected");
    } catch (error) {
        console.log("MOGODB CONNECTION FAILED", error);
        process.exit(1);
    }
};

export default connectDB;
