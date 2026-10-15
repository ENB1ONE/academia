import { Routes, Route, Navigate } from 'react-router-dom';
import CookieConsent from './components/layout/CookieConsent';
import PwaInstallPrompt from './components/layout/PwaInstallPrompt';
import ErrorBoundary from './components/ErrorBoundary';
import useAuthStore from './store/authStore';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

// Existing Pages
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

// New V2 Modules
import PreWorkoutPage from './pages/monitoring/PreWorkoutPage';
import WorkoutTypesSettingsPage from './pages/settings/WorkoutTypesSettingsPage';
import GroupsPage from './pages/groups/GroupsPage';
import PlanningPage from './pages/planning/PlanningPage';
import CollectiveLogPage from './pages/workouts/CollectiveLogPage';
import NeuromuscularPage from './pages/monitoring/NeuromuscularPage';
import AssessmentTypesPage from './pages/assessments/AssessmentTypesPage';
import RecordAssessmentPage from './pages/assessments/RecordAssessmentPage';
import GoalsPage from './pages/goals/GoalsPage';
import MonitoringInvitePage from './pages/monitoring/MonitoringInvitePage';
import GroupMonitoringPage from './pages/monitoring/GroupMonitoringPage';

// Public Kiosk & Checkin Routes
import QuickCheckinPage from './pages/totem/QuickCheckinPage';
import TotemPage from './pages/totem/TotemPage';

const ProtectedRoute = ({ children, requiredRole, coachOnly }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/" replace />;
  
  const role = (user?.role || '').toLowerCase().trim();
  const isAtleta = role === 'atleta' || role === 'athlete' || role === 'member';

  if (coachOnly && isAtleta) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <>
      <PwaInstallPrompt />
      <CookieConsent />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        {/* Public Kiosk and Invitation check-in */}
        <Route path="/checkin/:token" element={<QuickCheckinPage />} />
        <Route path="/totem" element={<TotemPage />} />
        
        {/* Protected Authenticated Routes */}
        <Route element={
          <ProtectedRoute>
            <ErrorBoundary>
              <DashboardLayout />
            </ErrorBoundary>
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/athletes" element={
            <ProtectedRoute coachOnly>
              <AthletesPage />
            </ProtectedRoute>
          } />
          <Route path="/athletes/:id" element={<AthleteDetailPage />} />
          
          {/* Workouts */}
          <Route path="/workouts/new" element={
            <ProtectedRoute coachOnly>
              <CreateWorkoutPage />
            </ProtectedRoute>
          } />
          <Route path="/workouts/collective-log" element={
            <ProtectedRoute coachOnly>
              <CollectiveLogPage />
            </ProtectedRoute>
          } />
          
          {/* Monitoring Engine */}
          <Route path="/monitoring/pre-workout" element={<PreWorkoutPage />} />
          <Route path="/monitoring/pse" element={<PsePage />} />
          <Route path="/monitoring/wellness" element={<WellnessPage />} />
          <Route path="/monitoring/pain" element={<PainMapPage />} />
          <Route path="/monitoring/menstrual" element={<MenstrualCyclePage />} />
          <Route path="/monitoring/physical-tests" element={
            <ProtectedRoute coachOnly>
              <PhysicalTestsPage />
            </ProtectedRoute>
          } />
          <Route path="/monitoring/neuromuscular" element={
            <ProtectedRoute coachOnly>
              <NeuromuscularPage />
            </ProtectedRoute>
          } />
          <Route path="/monitoring/group" element={
            <ProtectedRoute coachOnly>
              <GroupMonitoringPage />
            </ProtectedRoute>
          } />
          <Route path="/monitoring/invite" element={
            <ProtectedRoute coachOnly>
              <MonitoringInvitePage />
            </ProtectedRoute>
          } />
          
          {/* Groups & Planning */}
          <Route path="/groups" element={
            <ProtectedRoute coachOnly>
              <GroupsPage />
            </ProtectedRoute>
          } />
          <Route path="/planning" element={
            <ProtectedRoute coachOnly>
              <PlanningPage />
            </ProtectedRoute>
          } />
          <Route path="/planning/individual" element={
            <ProtectedRoute coachOnly>
              <PlanningPage />
            </ProtectedRoute>
          } />
          <Route path="/planning/collective" element={
            <ProtectedRoute coachOnly>
              <PlanningPage />
            </ProtectedRoute>
          } />
          
          {/* Custom Assessments & Goals */}
          <Route path="/assessments/types" element={
            <ProtectedRoute coachOnly>
              <AssessmentTypesPage />
            </ProtectedRoute>
          } />
          <Route path="/assessments/record" element={
            <ProtectedRoute coachOnly>
              <RecordAssessmentPage />
            </ProtectedRoute>
          } />
          <Route path="/goals" element={<GoalsPage />} />
          
          {/* Settings */}
          <Route path="/settings/workout-types" element={
            <ProtectedRoute coachOnly>
              <WorkoutTypesSettingsPage />
            </ProtectedRoute>
          } />
          
          {/* Admin only route */}
          <Route path="/admin/trainers" element={
            <ProtectedRoute requiredRole="admin">
              <AdminTrainersPage />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
