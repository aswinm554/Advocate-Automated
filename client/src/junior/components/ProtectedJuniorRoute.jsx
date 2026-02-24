import { Navigate, Outlet } from "react-router-dom";

export const ProtectedJuniorRoute = ()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "junior_advocate") {
        return <Navigate to= "/" replace/>
    } return <Outlet/>
}