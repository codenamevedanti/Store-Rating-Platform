import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const roleBadge = (role) => {
  const colors = { admin: '#7c3aed', user: '#0891b2', store_owner: '#d97706' };
  const labels = { admin: 'Administrator', user: 'Normal User', store_owner: 'Store Owner' };
  return (
    <span style={{ background: colors[role] || '#64748b', color: '#fff', fontSize: '12px', padding: '4px 12px', borderRadius: '20px', fontWeight: '500' }}>
      {labels[role] || role}
    </span>
  );
};

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(`/users/${id}`)
      .then(({ data }) => setUser(data))
      .catch(() => setError('Failed to load user details.'));
  }, [id]);

  if (error) return (
    <div style={styles.page}>
      <div style={styles.alert}>{error}</div>
      <button style={styles.backBtn} onClick={() => navigate('/admin/users')}>← Back to Users</button>
    </div>
  );

  if (!user) return <div style={styles.page}><p style={{ color: '#64748b' }}>Loading...</p></div>;

  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={() => navigate('/admin/users')}>← Back to Users</button>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.avatar}>{user.name?.charAt(0).toUpperCase()}</div>
          <div>
            <h2 style={styles.name}>{user.name}</h2>
            <p style={styles.email}>{user.email}</p>
            <div style={{ marginTop: '8px' }}>{roleBadge(user.role)}</div>
          </div>
        </div>

        <div style={styles.divider} />

        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>📧 Email</div>
            <div style={styles.infoValue}>{user.email}</div>
          </div>
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>📍 Address</div>
            <div style={styles.infoValue}>{user.address || '—'}</div>
          </div>
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>👤 Role</div>
            <div style={styles.infoValue}>{roleBadge(user.role)}</div>
          </div>
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>📅 Joined</div>
            <div style={styles.infoValue}>
              {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>

          {/* Show store rating if store owner */}
          {user.role === 'store_owner' && (
            <div style={{ ...styles.infoItem, gridColumn: '1 / -1', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '16px' }}>
              <div style={styles.infoLabel}>⭐ Store Rating</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                {user.avgRating ? (
                  <>
                    <span style={{ fontSize: '36px', fontWeight: '700', color: '#d97706' }}>{user.avgRating}</span>
                    <div>
                      <div style={{ color: '#f59e0b', fontSize: '22px', letterSpacing: '2px' }}>
                        {'★'.repeat(Math.round(user.avgRating))}{'☆'.repeat(5 - Math.round(user.avgRating))}
                      </div>
                      {user.Store && <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>Store: {user.Store.name}</div>}
                    </div>
                  </>
                ) : (
                  <span style={{ color: '#94a3b8', fontSize: '14px' }}>No ratings received yet</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '32px', maxWidth: '700px', margin: '0 auto' },
  backBtn: { background: 'transparent', border: '1.5px solid #e2e8f0', color: '#475569', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', marginBottom: '24px' },
  alert: { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' },
  card: { background: '#fff', borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '20px', padding: '28px' },
  avatar: { width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: '700', flexShrink: 0 },
  name: { fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px' },
  email: { color: '#64748b', fontSize: '14px', margin: 0 },
  divider: { borderTop: '1px solid #f1f5f9' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '24px' },
  infoItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  infoLabel: { fontSize: '12px', color: '#94a3b8', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' },
  infoValue: { fontSize: '14px', color: '#1e293b', fontWeight: '500' },
};

export default UserDetail;