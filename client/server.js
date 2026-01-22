import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import adminReportRoutes from "./src/routes/admin/reportRoutes.js";
import advocateRoutes from "./src/routes/admin/advocatesRoutes.js";
import cookieParser from "cookie-parser";




dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/admin/reports", adminReportRoutes);
app.use("/api/admin/advocates", advocateRoutes);



app.listen(process.env.PORT, ()=> {
    console.log(`Server running on port ${process.env.PORT}`);
    
});

