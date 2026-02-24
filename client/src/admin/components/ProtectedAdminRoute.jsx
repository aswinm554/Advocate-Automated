import { Navigate, Outlet } from "react-router-dom";

export const ProtectedAdminRoute = ()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
        return <Navigate to= "/" replace/>
    } return <Outlet/>
}