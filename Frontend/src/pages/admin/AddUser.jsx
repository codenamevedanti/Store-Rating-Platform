import { useState } from 'react';
import API from '../../api/axios';

const AddUser = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name || form.name.length < 20 || form.name.length > 60) errs.name = 'Name must be 20–60 characters.';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email.';
    if (!form.password || form.password.length < 8 || form.password.length > 16 ||
      !/[A-Z]/.test(form.password) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password))
      errs.password = '8–16 chars, 1 uppercase, 1 special character.';
    if (form.address && form.address.length > 400) errs.address = 'Max 400 characters.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setSuccess(''); setLoading(true);
    try {
      await API.post('/users', form);
      setSuccess(`User created successfully as ${form.role}!`);
      setForm({ name: '', email: '', password: '', address: '', role: 'user' });
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Failed to create user.' });
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.title}>Add New User</h2>
          <p style={styles.subtitle}>Create a new user account</p>
        </div>
        {errors.general && <div style={styles.alert}>{errors.general}</div>}
        {success && <div style={styles.successBox}>{success}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input style={styles.input} placeholder="Minimum 20 characters"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            {errors.name && <span style={styles.err}>{errors.name}</span>}
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input style={styles.input} type="email" placeholder="user@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            {errors.email && <span style={styles.err}>{errors.email}</span>}
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" placeholder="8–16 chars, uppercase & special char"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            {errors.password && <span style={styles.err}>{errors.password}</span>}
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Address</label>
            <textarea style={{ ...styles.input, height: '80px', resize: 'none' }} placeholder="Address (max 400 chars)"
              value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            {errors.address && <span style={styles.err}>{errors.address}</span>}
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Role</label>
            <select style={styles.input} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="user">Normal User</option>
              <option value="admin">Administrator</option>
              <option value="store_owner">Store Owner</option>
            </select>
          </div>
          <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '32px', background: '#f8fafc', minHeight: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' },
  card: { background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', width: '100%', maxWidth: '480px', overflow: 'hidden' },
  cardHeader: { padding: '24px 28px 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', marginBottom: '24px' },
  title: { fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px' },
  subtitle: { color: '#64748b', fontSize: '13px', margin: 0 },
  alert: { margin: '0 28px 16px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px' },
  successBox: { margin: '0 28px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '10px 14px', borderRadius: '8px', fontSize: '13px' },
  form: { padding: '0 28px 28px', display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '13px', fontWeight: '500', color: '#374151' },
  input: { padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', color: '#1e293b', width: '100%', boxSizing: 'border-box' },
  btn: { background: '#4f46e5', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '4px' },
  err: { color: '#dc2626', fontSize: '12px' },
};

export default AddUser;