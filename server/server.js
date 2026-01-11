import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";



dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);



app.listen(process.env.PORT, ()=> {
    console.log(`Server running on port ${process.env.PORT}`);
    
});

