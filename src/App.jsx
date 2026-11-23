import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import CoachDashboard from './pages/coach/CoachDashboard';
import MemberDashboard from './pages/member/MemberDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';

// Smart redirector for root "/"
function HomeRedirect() {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-deep flex items-center justify-center">
        <div className="text-ivory-warm font-display tracking-widest animate-pulse text-lg">
          LOADING ROYAL GAMBIT...
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to user's assigned dashboard
  switch (userRole) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'coach':
      return <Navigate to="/coach/dashboard" replace />;
    default:
      return <Navigate to="/member/dashboard" replace />;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Protected Dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />

          {/* Coach Protected Dashboard */}
          <Route
            path="/coach/dashboard"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['coach']}>
                  <CoachDashboard />
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />

          {/* Member Protected Dashboard */}
          <Route
            path="/member/dashboard"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['member']}>
                  <MemberDashboard />
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
