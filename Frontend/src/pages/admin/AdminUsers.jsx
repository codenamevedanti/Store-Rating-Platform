import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const roleBadge = (role) => {
  const colors = { admin: '#7c3aed', user: '#0891b2', store_owner: '#d97706' };
  return (
    <span style={{ ...styles.badge, background: colors[role] || '#64748b' }}>
      {role === 'store_owner' ? 'Store Owner' : role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');

  const fetchUsers = (currentFilters = filters) => {
    API.get('/users', { params: { ...currentFilters, sortBy, order } })
      .then(({ data }) => setUsers(data));
  };

  useEffect(() => { fetchUsers(); }, [sortBy, order]);

  const toggleSort = (field) => {
    if (sortBy === field) setOrder(o => o === 'ASC' ? 'DESC' : 'ASC');
    else { setSortBy(field); setOrder('ASC'); }
  };

  const arrow = (field) => sortBy === field ? (order === 'ASC' ? ' ↑' : ' ↓') : '';

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Users</h1>
        <span style={styles.count}>{users.length} total</span>
      </div>

      <div style={styles.filterBar}>
        {['name', 'email', 'address'].map(f => (
          <input key={f} style={styles.filterInput} placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
            value={filters[f]} 
            onChange={e => {
  const updated = { ...filters, role: e.target.value };
  setFilters(updated);
  fetchUsers(updated);
}} />
        ))}
        <select style={styles.filterInput} value={filters.role}
          onChange={e => setFilters({ ...filters, role: e.target.value })}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="store_owner">Store Owner</option>
        </select>
        <button style={styles.searchBtn} onClick={fetchUsers}>Search</button>
        <button style={styles.clearBtn} 
        onClick={() => {
          const cleared = { name: '', email: '', address: '', role: '' };
          setFilters(cleared);
          fetchUsers(cleared);
        }}>Clear</button>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              {['name', 'email', 'address', 'role'].map(f => (
                <th key={f} style={styles.th} onClick={() => toggleSort(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}{arrow(f)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id} style={{ ...styles.tr, background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td style={styles.td}><strong style={{ color: '#1e293b' }}>{u.name}</strong></td>
                <td style={styles.td}>{u.email}</td>
                <td style={styles.td}>{u.address}</td>
                <td style={styles.td}>{roleBadge(u.role)}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={4} style={styles.empty}>No users found.</td></tr>
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
  filterInput: { padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: '7px', fontSize: '13px', color: '#374151', outline: 'none' },
  searchBtn: { padding: '8px 18px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '7px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
  clearBtn: { padding: '8px 18px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '7px', cursor: 'pointer', fontSize: '13px' },
  tableWrap: { background: '#fff', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '13px 18px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', background: '#f8fafc', cursor: 'pointer', userSelect: 'none', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 18px', fontSize: '13px', color: '#64748b' },
  badge: { color: '#fff', fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '500' },
  empty: { textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '14px' },
};

export default AdminUsers;