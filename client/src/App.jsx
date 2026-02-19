import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignupLogin from './pages/Signup-Login';
import AdminLayout from './admin/layout/AdminLayout';
import Dashboard from "./admin/pages/Dashboard";
import AdvocateDashboard from './advocate/pages/Dashboard';
import AdvocateLayout from './advocate/layout/AdvocateLayout';
import Advocates from './admin/pages/Advocates';
import { ProtectedAdminRoute } from './admin/components/protectedAdminRoute';
import { ProtectedAdvocateRoute } from './advocate/components/protectedAdvocateRoute';
import AdminProfile from './admin/pages/AdminProfile';
import AdvocateAppointments from './advocate/pages/Appointments';
import Cases from './advocate/pages/Cases';
import Clients from './advocate/pages/Clients';
import Payments from './advocate/pages/Payments';


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
            <Route path="profile" element={<AdminProfile />} />

          </Route>
        </Route>
        <Route element={<ProtectedAdvocateRoute />}>
          <Route path="/advocate" element={<AdvocateLayout />}>
            <Route index element={<AdvocateDashboard />} />
            <Route path="appointments" element={<AdvocateAppointments />} />
            <Route path="cases" element={<Cases />} />
            <Route path="clients" element={<Clients />} />
            <Route path="payments" element={<Payments />} />





          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App