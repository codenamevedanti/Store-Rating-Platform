import { useState } from 'react';
import API from '../api/axios';

const ChangePassword = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const p = form.newPassword;
    if (!p || p.length < 8 || p.length > 16 ||
      !/[A-Z]/.test(p) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p))
      return '8–16 chars, must include 1 uppercase and 1 special character.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError(''); setSuccess(''); setLoading(true);
    try {
      await API.put('/auth/change-password', form);
      setSuccess('Password updated successfully!');
      setForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password.');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.icon}>🔐</div>
          <h2 style={styles.title}>Change Password</h2>
          <p style={styles.subtitle}>Update your account password</p>
        </div>
        {error && <div style={styles.alert}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Current Password</label>
            <input style={styles.input} type="password" placeholder="Enter current password"
              value={form.currentPassword} onChange={e => setForm({ ...form, currentPassword: e.target.value })} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>New Password</label>
            <input style={styles.input} type="password" placeholder="8–16 chars, uppercase & special char"
              value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} required />
            <span style={styles.hint}>Must be 8–16 characters with at least 1 uppercase letter and 1 special character</span>
          </div>
          <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '32px', background: '#f8fafc', minHeight: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' },
  card: { background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', width: '100%', maxWidth: '440px', overflow: 'hidden' },
  cardHeader: { padding: '28px 28px 20px', borderBottom: '1px solid #f1f5f9', marginBottom: '24px', textAlign: 'center' },
  icon: { fontSize: '36px', marginBottom: '8px' },
  title: { fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px' },
  subtitle: { color: '#64748b', fontSize: '13px', margin: 0 },
  alert: { margin: '0 28px 16px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px' },
  successBox: { margin: '0 28px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '10px 14px', borderRadius: '8px', fontSize: '13px' },
  form: { padding: '0 28px 28px', display: 'flex', flexDirection: 'column', gap: '18px' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '13px', fontWeight: '500', color: '#374151' },
  input: { padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', color: '#1e293b', width: '100%', boxSizing: 'border-box' },
  hint: { fontSize: '11px', color: '#94a3b8' },
  btn: { background: '#4f46e5', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
};

export default ChangePassword;