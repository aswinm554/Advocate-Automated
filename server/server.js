import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import adminReportRoutes from "./src/routes/admin/reportRoutes.js";
import advocateRoutes from "./src/routes/admin/advocatesRoutes.js";
import activityRoutes from "./src/routes/admin/activityRoutes.js";
import adminProfileRoutes from "./src/routes/admin/adminProfileRoutes.js";
import caseRoutes from "./src/routes/advocate/caseRoutes.js";
import dashboardRoutes from "./src/routes/advocate/dashboardRoutes.js";
import advocateAppointmentRoutes from "./src/routes/advocate/appointmentRoutes.js";
import advocateClientRoutes from "./src/routes/advocate/clientRoutes.js";
import clientAppointmentRoutes from "./src/routes/client/appointmentRoutes.js";
import advocateTaskRoutes from "./src/routes/advocate/taskRoutes.js";
import juniorTaskRoutes from "./src/routes/junior/taskRoutes.js";
import advocateJunior from "./src/routes/advocate/juniorRoutes.js";
import advocateDocument from "./src/routes/advocate/documentRoutes.js";
import juniorDocument from "./src/routes/junior/documentRoutes.js";
import clientDocument from "./src/routes/client/documentRoutes.js";
import clientPayment from "./src/routes/client/paymentRoutes.js";
import advocatePayment from "./src/routes/advocate/paymentRoutes.js";
import adminPayment from "./src/routes/admin/paymentRoutes.js";






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
//ADMIN ROUTES
app.use("/api/admin/reports", adminReportRoutes)
app.use("/api/admin/advocates", advocateRoutes)
app.use("/api/admin/activity", activityRoutes)
app.use("/api/admin", adminProfileRoutes)
app.use("/api/admin/payments", adminPayment);


//ADVOCATE ROUTES
app.use("/api/advocate/dashboard", dashboardRoutes)
app.use("/api/advocate/cases", caseRoutes)
app.use("/api/advocate/appointments", advocateAppointmentRoutes)
app.use("/api/advocate/clients", advocateClientRoutes)
app.use("/api/advocate/juniors", advocateJunior)
app.use("/api/advocate/tasks", advocateTaskRoutes)
app.use("/api/advocate/documents", advocateDocument)
app.use("/api/advocate/payments", advocatePayment);


//JUNIOR ROUTES
app.use("/api/junior/tasks", juniorTaskRoutes)
app.use("/api/junior/documents", juniorDocument)

//CLIENT ROUTES
app.use("/api/client/appointments", clientAppointmentRoutes)
app.use("/api/client/documents", clientDocument)
app.use("/api/client/payments", clientPayment)
  




app.listen(process.env.PORT, ()=> {
    console.log(`Server running on port ${process.env.PORT}`);
    
});

