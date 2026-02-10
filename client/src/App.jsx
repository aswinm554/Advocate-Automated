import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignupLogin from './pages/Signup-Login';
import AdminLayout from './admin/layout/AdminLayout';
import Dashboard from "./admin/pages/Dashboard";
import Advocates from './admin/pages/Advocates';
import { ProtectedAdminRoute } from './admin/components/protectedAdminRoute';
import AdminProfile from './admin/pages/AdminProfile';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<SignupLogin />} />
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="advocates" element={<Advocates />} />
            <Route path="profile" element={<AdminProfile />}/>

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App