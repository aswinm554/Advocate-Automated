import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignupLogin from './pages/Signup-Login';
import AdminLayout from './admin/layout/AdminLayout';
import Dashboard from "./admin/pages/Dashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<SignupLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard/>} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App