import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AthletesPage from './pages/athletes/AthletesPage';
import AthleteDetailPage from './pages/athletes/AthleteDetailPage';
import CreateWorkoutPage from './pages/workouts/CreateWorkoutPage';
import PsePage from './pages/monitoring/PsePage';
import WellnessPage from './pages/monitoring/WellnessPage';
import PainMapPage from './pages/monitoring/PainMapPage';
import MenstrualCyclePage from './pages/monitoring/MenstrualCyclePage';
import PhysicalTestsPage from './pages/monitoring/PhysicalTestsPage';
import AdminTrainersPage from './pages/admin/AdminTrainersPage';
import ProfilePage from './pages/auth/ProfilePage';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/" replace />;
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="athletes" element={<AthletesPage />} />
        <Route path="athletes/:id" element={<AthleteDetailPage />} />
        <Route path="workouts/new" element={<CreateWorkoutPage />} />
        <Route path="monitoring/pse" element={<PsePage />} />
        <Route path="monitoring/wellness" element={<WellnessPage />} />
        <Route path="monitoring/pain" element={<PainMapPage />} />
        <Route path="monitoring/menstrual" element={<MenstrualCyclePage />} />
        <Route path="monitoring/physical-tests" element={<PhysicalTestsPage />} />
        
        {/* Admin only route */}
        <Route path="admin/trainers" element={
          <ProtectedRoute requiredRole="admin">
            <AdminTrainersPage />
          </ProtectedRoute>
        } />
      </Route>
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
