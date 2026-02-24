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
import JuniorAdvocates from './advocate/pages/JuniorAdvocate';
import AdvocateTasks from './advocate/pages/Tasks';
import Documents from './advocate/pages/Documents';
import ClientLayout from './client/layout/ClientLayout';
import ClientDashboard from './client/pages/Dashboard';
import { ProtectedClientRoute } from './client/components/ProtectedClientRoute';
import Appointments from './client/pages/Appointments';
import ClientCases from './client/pages/Cases';
import ClientDocuments from './client/pages/Documents';
import ClientPayments from './client/pages/Payments';
import LandingPage from './pages/LandingPage';
import { ProtectedJuniorRoute } from './junior/components/ProtectedJuniorRoute';
import JuniorLayout from './junior/layout/JuniorLayout';
import JuniorDashboard from './junior/pages/Dashboard';
import JuniorTasks from './junior/pages/Task';
import JuniorCases from './junior/pages/Cases';
import JuniorDocuments from './junior/pages/Documents';
import AdminClients from './admin/pages/Client';
import AdvocateProfile from './advocate/pages/AdvocateProfile';
import ClientProfile from './client/pages/ClientProfile';
import JuniorProfile from './junior/pages/JuniorProfile';
import Reports from './admin/pages/Reports';



const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<SignupLogin />} />
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="clients" element={<AdminClients />} />
            <Route path="advocates" element={<Advocates />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="reports" element={<Reports />} />



          </Route>
        </Route>
        <Route element={<ProtectedAdvocateRoute />}>
          <Route path="/advocate" element={<AdvocateLayout />}>
            <Route index element={<AdvocateDashboard />} />
            <Route path="appointments" element={<AdvocateAppointments />} />
            <Route path="cases" element={<Cases />} />
            <Route path="clients" element={<Clients />} />
            <Route path="payments" element={<Payments />} />
            <Route path="juniors" element={<JuniorAdvocates />} />
            <Route path="tasks" element={<AdvocateTasks />} />
            <Route path="documents" element={<Documents />} />
            <Route path="profile" element={<AdvocateProfile />} />



          </Route>
        </Route>
        <Route element={<ProtectedClientRoute />}>
          <Route path="/client" element={<ClientLayout />}>
            <Route index element={<ClientDashboard />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="cases" element={<ClientCases />} />
            <Route path="documents" element={<ClientDocuments />} />
            <Route path="payments" element={<ClientPayments />} />
            <Route path="profile" element={<ClientProfile />} />


          </Route>
        </Route>
        <Route element={<ProtectedJuniorRoute />}>
          <Route path="/junior" element={<JuniorLayout />}>
            <Route index element={<JuniorDashboard />} />
            <Route path="tasks" element={<JuniorTasks />} />
            <Route path="cases" element={<JuniorCases />} />
            <Route path="documents" element={<JuniorDocuments />} />
            <Route path="profile" element={<JuniorProfile />} />



          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App