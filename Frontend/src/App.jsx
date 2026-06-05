import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Register from './pages/Register';
import ChangePassword from './pages/ChangePassword';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStores from './pages/admin/AdminStores';
import AddUser from './pages/admin/AddUser';
import AddStore from './pages/admin/AddStore';
import UserDetail from './pages/admin/UserDetail';

import UserStores from './pages/user/UserStores';
import OwnerDashboard from './pages/owner/OwnerDashboard';

const AppRoutes = () => {
  const { user } = useAuth();

  const getHome = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'user') return '/user/stores';
    if (user.role === 'store_owner') return '/owner/dashboard';
    return '/login';
  };

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to={getHome()} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/change-password" element={
          <PrivateRoute roles={['user', 'store_owner']}>
            <ChangePassword />
          </PrivateRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>
        } />
        <Route path="/admin/users" element={
          <PrivateRoute roles={['admin']}><AdminUsers /></PrivateRoute>
        } />
        <Route path="/admin/stores" element={
          <PrivateRoute roles={['admin']}><AdminStores /></PrivateRoute>
        } />
        <Route path="/admin/add-user" element={
          <PrivateRoute roles={['admin']}><AddUser /></PrivateRoute>
        } />

        <Route path="/admin/add-store" element={
          <PrivateRoute roles={['admin']}><AddStore /></PrivateRoute>
        } />

      <Route path="/admin/users/:id" element={
         <PrivateRoute roles={['admin']}><UserDetail /></PrivateRoute>
      } />

        {/* User Routes */}
        <Route path="/user/stores" element={
          <PrivateRoute roles={['user']}><UserStores /></PrivateRoute>
        } />

        {/* Owner Routes */}
        <Route path="/owner/dashboard" element={
          <PrivateRoute roles={['store_owner']}><OwnerDashboard /></PrivateRoute>
        } />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;