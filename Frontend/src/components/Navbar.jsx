import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>StoreRating</div>
      <div style={styles.links}>
        {user?.role === 'admin' && (
          <>
            <Link style={styles.link} to="/admin/dashboard">Dashboard</Link>
            <Link style={styles.link} to="/admin/users">Users</Link>
            <Link style={styles.link} to="/admin/stores">Stores</Link>
            <Link style={styles.link} to="/admin/add-user">Add User</Link>
            <Link style={styles.link} to="/admin/add-store">Add Store</Link>
          </>
        )}
        {user?.role === 'user' && (
          <>
            <Link style={styles.link} to="/user/stores">Stores</Link>
            <Link style={styles.link} to="/change-password">Change Password</Link>
          </>
        )}
        {user?.role === 'store_owner' && (
          <>
            <Link style={styles.link} to="/owner/dashboard">Dashboard</Link>
            <Link style={styles.link} to="/change-password">Change Password</Link>
          </>
        )}
        <span style={styles.username}>{user?.name?.split(' ')[0]}</span>
        <button style={styles.logout} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 24px', background: '#2c3e50', color: '#fff' },
  brand: { fontSize: '20px', fontWeight: 'bold', color: '#3498db' },
  links: { display: 'flex', alignItems: 'center', gap: '16px' },
  link: { color: '#ecf0f1', textDecoration: 'none', fontSize: '14px' },
  username: { color: '#bdc3c7', fontSize: '13px' },
  logout: { background: '#e74c3c', color: '#fff', border: 'none',
    padding: '6px 14px', borderRadius: '4px', cursor: 'pointer' },
};

export default Navbar;