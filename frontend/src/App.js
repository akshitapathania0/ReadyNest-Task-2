import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Profile from './pages/Profile';

import Dashboard from './pages/student/Dashboard';
import Timetable from './pages/student/Timetable';
import Assignments from './pages/student/Assignments';
import Attendance from './pages/student/Attendance';
import Notes from './pages/student/Notes';
import Notices from './pages/student/Notices';

import AdminDashboard from './pages/admin/Dashboard';
import ManageNotices from './pages/admin/ManageNotices';
import ManageTimetable from './pages/admin/ManageTimetable';
import ManageAssignments from './pages/admin/ManageAssignments';
import ManageNotes from './pages/admin/ManageNotes';
import Students from './pages/admin/Students';
import ManageAttendance from './pages/admin/ManageAttendance';

function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text2)' }}>Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} /> : <Login />} />

      {/* Student routes */}
      <Route path="/" element={<PrivateRoute role="student"><Layout /></PrivateRoute>}>
        <Route path="dashboard"  element={<Dashboard />} />
        <Route path="timetable"  element={<Timetable />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="notes"      element={<Notes />} />
        <Route path="notices"    element={<Notices />} />
        <Route path="profile"    element={<Profile />} />
        <Route index element={<Navigate to="/dashboard" />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<PrivateRoute role="admin"><Layout /></PrivateRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="notices"    element={<ManageNotices />} />
        <Route path="timetable"  element={<ManageTimetable />} />
        <Route path="assignments" element={<ManageAssignments />} />
        <Route path="notes"      element={<ManageNotes />} />
        <Route path="students"   element={<Students />} />
        <Route path="attendance" element={<ManageAttendance />} />
        <Route path="profile"    element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
