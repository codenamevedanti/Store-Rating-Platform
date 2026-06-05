import { useEffect, useState } from 'react';
import API from '../../api/axios';

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');

  const fetchStores = () => {
    API.get('/stores', { params: { ...filters, sortBy, order } }).then(({ data }) => setStores(data));
  };

  useEffect(() => { fetchStores(); }, [sortBy, order]);

  const toggleSort = (field) => {
    if (sortBy === field) setOrder(o => o === 'ASC' ? 'DESC' : 'ASC');
    else { setSortBy(field); setOrder('ASC'); }
  };

  const arrow = (field) => sortBy === field ? (order === 'ASC' ? ' ↑' : ' ↓') : '';

  const renderStars = (rating) => {
    if (!rating) return <span style={styles.noRating}>No ratings yet</span>;
    return (
      <span style={styles.rating}>
        <span style={styles.star}>⭐</span>
        <strong>{rating}</strong>
      </span>
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Stores</h1>
        <span style={styles.count}>{stores.length} total</span>
      </div>

      <div style={styles.filterBar}>
        <input style={styles.filterInput} placeholder="Search by name"
          value={filters.name} onChange={e => setFilters({ ...filters, name: e.target.value })} />
        <input style={styles.filterInput} placeholder="Search by address"
          value={filters.address} onChange={e => setFilters({ ...filters, address: e.target.value })} />
        <button style={styles.searchBtn} onClick={fetchStores}>Search</button>
        <button style={styles.clearBtn} onClick={() => setFilters({ name: '', address: '' })}>Clear</button>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              {['name', 'email', 'address'].map(f => (
                <th key={f} style={styles.th} onClick={() => toggleSort(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}{arrow(f)}
                </th>
              ))}
              <th style={styles.th}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s, i) => (
              <tr key={s.id} style={{ ...styles.tr, background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td style={styles.td}><strong style={{ color: '#1e293b' }}>{s.name}</strong></td>
                <td style={styles.td}>{s.email}</td>
                <td style={styles.td}>{s.address}</td>
                <td style={styles.td}>{renderStars(s.avgRating)}</td>
              </tr>
            ))}
            {stores.length === 0 && (
              <tr><td colSpan={4} style={styles.empty}>No stores found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '32px', maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' },
  title: { fontSize: '26px', fontWeight: '700', color: '#1e293b', margin: 0 },
  count: { background: '#e2e8f0', color: '#475569', fontSize: '13px', padding: '3px 10px', borderRadius: '20px' },
  filterBar: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', background: '#fff', padding: '16px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  filterInput: { padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: '7px', fontSize: '13px', color: '#374151' },
  searchBtn: { padding: '8px 18px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '7px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
  clearBtn: { padding: '8px 18px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '7px', cursor: 'pointer', fontSize: '13px' },
  tableWrap: { background: '#fff', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '13px 18px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', background: '#f8fafc', cursor: 'pointer', userSelect: 'none', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 18px', fontSize: '13px', color: '#64748b' },
  rating: { display: 'flex', alignItems: 'center', gap: '4px', color: '#1e293b', fontSize: '14px' },
  star: { fontSize: '14px' },
  noRating: { color: '#94a3b8', fontSize: '12px' },
  empty: { textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '14px' },
};

export default AdminStores;