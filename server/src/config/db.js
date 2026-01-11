import mongoose from "mongoose";

const connectDB = async () => {
try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected"); {}
    
} catch (error) {
    console.error("MongoDB connection failed", error);
    process.getMaxListeners(1);
}

};

export default connectDB;