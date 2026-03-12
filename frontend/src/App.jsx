import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './store/AuthContext';
import { ThemeProvider } from './store/ThemeContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children, roles, allowGuest = false }) => {
  const { user } = useAuth();
  if (!user && !allowGuest) return <Navigate to="/login" />;
  if (user && roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === 'TEACHER' ? '/teacher' : '/dashboard'} />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-300">
            <Navbar />
            <main className="flex-grow pt-8 pb-20 overflow-x-hidden">
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Dashboard & Features */}
                <Route path="/dashboard" element={
                  <ProtectedRoute allowGuest={true}>
                    <UserDashboardWrapper />
                  </ProtectedRoute>
                } />
                <Route path="/materials" element={
                  <ProtectedRoute allowGuest={true}>
                    <UserDashboardWrapper initialTab="materials" />
                  </ProtectedRoute>
                } />
                <Route path="/quizzes" element={
                  <ProtectedRoute allowGuest={true}>
                    <UserDashboardWrapper initialTab="quizzes" />
                  </ProtectedRoute>
                } />
                <Route path="/subjects" element={
                  <ProtectedRoute allowGuest={true}>
                    <UserDashboardWrapper initialTab="subjects" />
                  </ProtectedRoute>
                } />
                <Route path="/upload" element={
                  <ProtectedRoute roles={['TEACHER']}>
                    <TeacherDashboard showUploadDirectly={true} />
                  </ProtectedRoute>
                } />

                {/* Role-specific redirect catchers */}
                <Route path="/teacher" element={
                  <ProtectedRoute roles={['TEACHER']}>
                    <TeacherDashboard />
                  </ProtectedRoute>
                } />

                {/* Fallback & Redirects */}
                <Route path="/" element={<HomeRedirect />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <Toaster position="top-right" richColors closeButton />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

const UserDashboardWrapper = ({ initialTab }) => {
  const { user } = useAuth();
  if (user?.role === 'TEACHER') return <TeacherDashboard initialTab={initialTab} />;
  return <StudentDashboard initialTab={initialTab} />;
};

const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (user.role === 'TEACHER') return <Navigate to="/teacher" />;
  return <Navigate to="/dashboard" />;
};

export default App;
