import { useState, useEffect } from 'react';
import API from '../../api/axios';

const AddStore = () => {
  const [form, setForm] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [owners, setOwners] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch store_owner users for the dropdown
    API.get('/users', { params: { role: 'store_owner' } })
      .then(({ data }) => setOwners(data))
      .catch(() => {});
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.name || form.name.length < 20 || form.name.length > 60)
      errs.name = 'Store name must be 20–60 characters.';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Enter a valid email.';
    if (!form.address)
      errs.address = 'Address is required.';
    if (form.address && form.address.length > 400)
      errs.address = 'Address max 400 characters.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setSuccess(''); setLoading(true);
    try {
      await API.post('/stores', {
        ...form,
        owner_id: form.owner_id || null,
      });
      setSuccess('Store created successfully!');
      setForm({ name: '', email: '', address: '', owner_id: '' });
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Failed to create store.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Add New Store</h2>
        {errors.general && <p style={styles.error}>{errors.general}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Store Name</label>
          <input style={styles.input} placeholder="20–60 characters"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          {errors.name && <p style={styles.fieldError}>{errors.name}</p>}

          <label style={styles.label}>Email</label>
          <input style={styles.input} type="email" placeholder="Store email"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          {errors.email && <p style={styles.fieldError}>{errors.email}</p>}

          <label style={styles.label}>Address</label>
          <textarea style={{ ...styles.input, height: '80px', resize: 'none' }}
            placeholder="Store address (max 400 chars)"
            value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          {errors.address && <p style={styles.fieldError}>{errors.address}</p>}

          <label style={styles.label}>Assign Owner (optional)</label>
          <select style={styles.input} value={form.owner_id}
            onChange={e => setForm({ ...form, owner_id: e.target.value })}>
            <option value="">-- No Owner --</option>
            {owners.map(o => (
              <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
            ))}
          </select>

          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Store'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', padding: '32px', background: '#f0f2f5', minHeight: '90vh' },
  card: { background: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '440px', height: 'fit-content' },
  title: { color: '#2c3e50', marginBottom: '24px' },
  label: { display: 'block', fontSize: '13px', color: '#555', marginBottom: '4px', fontWeight: '500' },
  input: { width: '100%', padding: '10px', marginBottom: '4px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontSize: '14px' },
  btn: { width: '100%', padding: '10px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '15px', marginTop: '12px' },
  error: { color: '#e74c3c', marginBottom: '12px', fontSize: '13px' },
  fieldError: { color: '#e74c3c', fontSize: '12px', marginBottom: '8px', marginTop: '0' },
  success: { color: '#27ae60', marginBottom: '12px', fontSize: '13px' },
};

export default AddStore;