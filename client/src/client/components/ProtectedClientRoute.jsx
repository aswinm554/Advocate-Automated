import { Navigate, Outlet } from "react-router-dom";

export const ProtectedClientRoute = ()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "client") {
        return <Navigate to= "/" replace/>
    } return <Outlet/>
}