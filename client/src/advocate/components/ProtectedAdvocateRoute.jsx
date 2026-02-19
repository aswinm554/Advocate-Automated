import { Navigate, Outlet } from "react-router-dom";

export const ProtectedAdvocateRoute = ()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "advocate") {
        return <Navigate to= "/login" replace/>
    } return <Outlet/>
}