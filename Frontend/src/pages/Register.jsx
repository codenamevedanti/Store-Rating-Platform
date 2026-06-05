import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    setErrors({}); setLoading(true);
    try {
      await API.post('/auth/register', form);
      setSuccess('Account created! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Registration failed.' });
    } finally { setLoading(false); }
  };

  const Field = ({ name, label, type = 'text', placeholder, multiline }) => (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      {multiline
        ? <textarea style={{ ...styles.input, height: '80px', resize: 'none' }} placeholder={placeholder}
            value={form[name]} onChange={e => setForm({ ...form, [name]: e.target.value })} />
        : <input style={styles.input} type={type} placeholder={placeholder}
            value={form[name]} onChange={e => setForm({ ...form, [name]: e.target.value })} />
      }
      {errors[name] && <span style={styles.fieldErr}>{errors[name]}</span>}
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>⭐</div>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join StoreRating today</p>
        </div>
        {errors.general && <div style={styles.alert}>{errors.general}</div>}
        {success && <div style={styles.successBox}>{success}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <Field name="name" label="Full Name" placeholder="Minimum 20 characters" />
          <Field name="email" label="Email Address" type="email" placeholder="you@example.com" />
          <Field name="address" label="Address" placeholder="Your address (max 400 chars)" multiline />
          <Field name="password" label="Password" type="password" placeholder="8–16 chars, uppercase & special char" />
          <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={styles.footer}>Already have an account? <Link style={styles.footerLink} to="/login">Sign in</Link></p>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  card: { background: '#fff', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  header: { textAlign: 'center', marginBottom: '28px' },
  logo: { fontSize: '36px', marginBottom: '8px' },
  title: { fontSize: '22px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px' },
  subtitle: { color: '#64748b', fontSize: '13px', margin: 0 },
  alert: { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' },
  successBox: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  field: { display: 'flex', flexDirection: 'column', gap: '4px' },
  label: { fontSize: '13px', fontWeight: '500', color: '#374151' },
  input: { padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', color: '#1e293b', width: '100%', boxSizing: 'border-box' },
  fieldErr: { color: '#dc2626', fontSize: '12px' },
  btn: { background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '4px' },
  footer: { textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#64748b' },
  footerLink: { color: '#667eea', fontWeight: '600', textDecoration: 'none' },
};

export default Register;