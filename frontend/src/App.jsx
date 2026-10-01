import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AthletesPage from './pages/athletes/AthletesPage';
import AthleteDetailPage from './pages/athletes/AthleteDetailPage';
import CreateWorkoutPage from './pages/workouts/CreateWorkoutPage';
import PsePage from './pages/monitoring/PsePage';
import WellnessPage from './pages/monitoring/WellnessPage';

import PainMapPage from './pages/monitoring/PainMapPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="athletes" element={<AthletesPage />} />
        <Route path="athletes/:id" element={<AthleteDetailPage />} />
        <Route path="workouts/new" element={<CreateWorkoutPage />} />
        <Route path="monitoring/pse" element={<PsePage />} />
        <Route path="monitoring/wellness" element={<WellnessPage />} />
        <Route path="monitoring/pain" element={<PainMapPage />} />
      </Route>
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
