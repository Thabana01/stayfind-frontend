import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FindAccommodation from './pages/FindAccommodation';
import PropertyDetails from './pages/PropertyDetails';
import StudentDashboard from './pages/StudentDashboard';
import LandlordDashboard from './pages/LandlordDashboard';
import ListProperty from './pages/ListProperty';
import AdminDashboard from './pages/AdminDashboard';
import PropertyModeration from './pages/PropertyModeration'; // <-- Added Moderation Page
import AIDataset from './pages/AIDataset'; // <-- Added AI Info Page
import SecurityDashboard from './pages/SecurityDashboard';
import GDPR from './pages/GDPR';
import Messages from './pages/Messages';
import Inbox from './pages/Inbox'; 
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          
          <Navbar />
          
          <div className="container" style={{ flex: 1, paddingBottom: '40px' }}>
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<FindAccommodation />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              
              {/* MESSAGING ROUTES (Protected) */}
              <Route path="/inbox" element={<ProtectedRoute allowedRoles={['student', 'landlord', 'admin']}><Inbox /></ProtectedRoute>} />
              <Route path="/messages/:landlordId" element={<ProtectedRoute allowedRoles={['student', 'landlord', 'admin']}><Messages /></ProtectedRoute>} />

              {/* STUDENT ONLY ROUTES */}
              <Route 
                path="/student-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* LANDLORD ONLY ROUTES */}
              <Route 
                path="/landlord-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['landlord']}>
                    <LandlordDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/list-property" 
                element={
                  <ProtectedRoute allowedRoles={['landlord']}>
                    <ListProperty />
                  </ProtectedRoute>
                } 
              />

              {/* ADMIN ONLY ROUTES */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/moderation" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <PropertyModeration />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ai-dataset" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AIDataset />
                  </ProtectedRoute>
                } 
              />

              {/* SECURITY ADMIN ONLY ROUTES */}
              <Route 
                path="/security-admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'security_admin']}>
                    <SecurityDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* GDPR / PRIVACY */}
              <Route 
                path="/gdpr" 
                element={
                  <ProtectedRoute allowedRoles={['student', 'landlord', 'admin']}>
                    <GDPR />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;