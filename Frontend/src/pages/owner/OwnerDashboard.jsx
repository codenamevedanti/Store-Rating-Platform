import { useEffect, useState } from 'react';
import API from '../../api/axios';

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/stores/owner/dashboard')
      .then(({ data }) => setData(data))
      .catch(() => setError('Failed to load dashboard.'));
  }, []);

  const renderStars = (count) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < count ? '#f59e0b' : '#e2e8f0', fontSize: '18px' }}>★</span>
    ));
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Store Dashboard</h1>
        <p style={styles.subtitle}>Overview of your store's performance</p>
      </div>
      {error && <div style={styles.alert}>{error}</div>}
      {data && (
        <>
          <div style={styles.topRow}>
            <div style={styles.storeCard}>
              <div style={styles.storeIcon}>🏪</div>
              <div>
                <h2 style={styles.storeName}>{data.store.name}</h2>
                <p style={styles.storeAddr}>📍 {data.store.address}</p>
              </div>
            </div>
            <div style={styles.ratingCard}>
              <div style={styles.ratingNum}>{data.avgRating || '—'}</div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
                {renderStars(Math.round(data.avgRating || 0))}
              </div>
              <div style={styles.ratingLabel}>Average Rating</div>
              <div style={styles.ratingCount}>{data.ratings.length} review{data.ratings.length !== 1 ? 's' : ''}</div>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Customer Reviews</h3>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Customer</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Rating</th>
                    <th style={styles.th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.ratings.map((r, i) => (
                    <tr key={r.id} style={{ ...styles.tr, background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                      <td style={styles.td}><strong style={{ color: '#1e293b' }}>{r.User?.name}</strong></td>
                      <td style={styles.td}>{r.User?.email}</td>
                      <td style={styles.td}>
                        <span style={styles.starRow}>{renderStars(r.value)}</span>
                        <span style={styles.ratingVal}>({r.value}/5)</span>
                      </td>
                      <td style={styles.td}>{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    </tr>
                  ))}
                  {data.ratings.length === 0 && (
                    <tr><td colSpan={4} style={styles.empty}>No reviews yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  page: { padding: '32px', maxWidth: '1100px', margin: '0 auto' },
  header: { marginBottom: '28px' },
  title: { fontSize: '26px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px' },
  subtitle: { color: '#64748b', fontSize: '14px', margin: 0 },
  alert: { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' },
  topRow: { display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', marginBottom: '28px', alignItems: 'start' },
  storeCard: { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', gap: '16px', alignItems: 'center' },
  storeIcon: { fontSize: '40px' },
  storeName: { fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px' },
  storeAddr: { color: '#64748b', fontSize: '13px', margin: 0 },
  ratingCard: { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', textAlign: 'center', minWidth: '160px' },
  ratingNum: { fontSize: '52px', fontWeight: '700', color: '#f59e0b', lineHeight: 1, marginBottom: '4px' },
  ratingLabel: { fontSize: '13px', color: '#64748b', fontWeight: '500' },
  ratingCount: { fontSize: '12px', color: '#94a3b8', marginTop: '4px' },
  section: {},
  sectionTitle: { fontSize: '17px', fontWeight: '600', color: '#1e293b', marginBottom: '14px' },
  tableWrap: { background: '#fff', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '13px 18px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', background: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 18px', fontSize: '13px', color: '#64748b' },
  starRow: { display: 'inline-flex' },
  ratingVal: { color: '#94a3b8', fontSize: '12px', marginLeft: '6px' },
  empty: { textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '14px' },
};

export default OwnerDashboard;