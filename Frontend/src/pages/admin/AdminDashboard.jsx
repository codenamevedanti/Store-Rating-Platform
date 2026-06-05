import { useEffect, useState } from 'react';
import API from '../../api/axios';

const StatCard = ({ label, value, icon, color }) => (
  <div style={{ ...styles.card, borderTop: `4px solid ${color}` }}>
    <div style={styles.cardIcon}>{icon}</div>
    <div style={{ ...styles.cardNum, color }}>{value ?? '—'}</div>
    <div style={styles.cardLabel}>{label}</div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get('/users/dashboard').then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <p style={styles.subtitle}>Welcome back, Administrator</p>
      </div>
      <div style={styles.grid}>
        <StatCard label="Total Users" value={stats?.totalUsers} icon="👥" color="#4f46e5" />
        <StatCard label="Total Stores" value={stats?.totalStores} icon="🏪" color="#0891b2" />
        <StatCard label="Total Ratings" value={stats?.totalRatings} icon="⭐" color="#d97706" />
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '32px', maxWidth: '1100px', margin: '0 auto' },
  header: { marginBottom: '32px' },
  title: { fontSize: '26px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px' },
  subtitle: { color: '#64748b', fontSize: '14px', margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' },
  card: { background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', textAlign: 'center' },
  cardIcon: { fontSize: '36px', marginBottom: '12px' },
  cardNum: { fontSize: '48px', fontWeight: '700', lineHeight: 1 },
  cardLabel: { fontSize: '14px', color: '#64748b', marginTop: '8px', fontWeight: '500' },
};

export default AdminDashboard;