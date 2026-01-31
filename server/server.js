import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import adminReportRoutes from "./src/routes/admin/reportRoutes.js";
import advocateRoutes from "./src/routes/admin/advocatesRoutes.js";
import activityRoutes from "./src/routes/admin/activityRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";





dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));



app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/admin/reports", adminReportRoutes);
app.use("/api/admin/advocates", advocateRoutes);
app.use("/api/admin/activity", activityRoutes)



app.listen(process.env.PORT, ()=> {
    console.log(`Server running on port ${process.env.PORT}`);
    
});

