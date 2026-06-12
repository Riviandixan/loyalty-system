import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authStore } from './store/auth.store';

import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MemberListPage from './pages/members/MemberListPage';
import MemberCreatePage from './pages/members/MemberCreatePage';
import MemberDetailPage from './pages/members/MemberDetailPage';
import MemberEditPage from './pages/members/MemberEditPage';
import TransactionListPage from './pages/transactions/TransactionListPage';
import TransactionCreatePage from './pages/transactions/TransactionCreatePage';
import RedeemListPage from './pages/redeems/RedeemListPage';
import RedeemCreatePage from './pages/redeems/RedeemCreatePage';
import UserListPage from './pages/users/UserListPage';
import AuditLogPage from './pages/AuditLogPage';
import ProfilePage from './pages/ProfilePage';

const PrivateRoute = ({ children }) => {
  return authStore.isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const user = authStore.getUser();
  if (!authStore.isAuthenticated()) return <Navigate to="/login" replace />;
  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  return !authStore.isAuthenticated() ? children : <Navigate to="/dashboard" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="members" element={<MemberListPage />} />
          <Route path="members/create" element={<MemberCreatePage />} />
          <Route path="members/:id" element={<MemberDetailPage />} />
          <Route path="members/:id/edit" element={<MemberEditPage />} />
          <Route path="transactions" element={<TransactionListPage />} />
          <Route path="transactions/create" element={<TransactionCreatePage />} />
          <Route path="redeems" element={<RedeemListPage />} />
          <Route path="redeems/create" element={<RedeemCreatePage />} />
          <Route path="users" element={<AdminRoute><UserListPage /></AdminRoute>} />
          <Route path="audit-logs" element={<AdminRoute><AuditLogPage /></AdminRoute>} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// 