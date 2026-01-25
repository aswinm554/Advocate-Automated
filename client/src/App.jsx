import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignupLogin from './pages/Signup-Login';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<SignupLogin/>} />
       
      </Routes>
    </BrowserRouter>
  )
}

export default App