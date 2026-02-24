
import "./src/config/env.js";
import express from "express";
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
import clientAppointment from "./src/routes/client/appointmentRoutes.js";
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
import clientCases from "./src/routes/client/caseRoutes.js"
import juniorDashboard from"./src/routes/junior/dashboardRoutes.js";
import adminClientRoutes from "./src/routes/admin/clientRoutes.js"
import advocateProfileRoutes from "./src/routes/advocate/advocateProfileRoutes.js"
import clientProfileRoutes from "./src/routes/client/clientProfileRoutes.js"
import juniorProfile from "./src/routes/junior/juniorProfileRoutes.js"
import juniorCase from "./src/routes/junior/caseRoutes.js"
import messageRoutes from "./src/routes/messageRoutes.js"
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
app.use("/api/admin/clients", adminClientRoutes)


//ADVOCATE ROUTES
app.use("/api/advocate/dashboard", dashboardRoutes)
app.use("/api/advocate/cases", caseRoutes)
app.use("/api/advocate/appointments", advocateAppointmentRoutes)
app.use("/api/advocate/clients", advocateClientRoutes)
app.use("/api/advocate/juniors", advocateJunior)
app.use("/api/advocate/tasks", advocateTaskRoutes)
app.use("/api/advocate/documents", advocateDocument)
app.use("/api/advocate/payments", advocatePayment)
app.use("/api/advocate", advocateProfileRoutes)


//JUNIOR ROUTES
app.use("/api/junior/tasks", juniorTaskRoutes)
app.use("/api/junior/documents", juniorDocument)
app.use("/api/junior/dashboard", juniorDashboard)
app.use("/api/junior/profile", juniorProfile)
app.use("/api/junior/cases", juniorCase)

//CLIENT ROUTES
app.use("/api/client/appointments", clientAppointment)
app.use("/api/client/documents", clientDocument)
app.use("/api/client/payments", clientPayment)
app.use("/api/client/cases", clientCases)
app.use("/api/client", clientProfileRoutes)

app.use("/api/messages", messageRoutes);
  




app.listen(process.env.PORT, ()=> {
    console.log(`Server running on port ${process.env.PORT}`);
    
});

