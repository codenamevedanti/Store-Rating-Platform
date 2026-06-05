import { useEffect, useState } from 'react';
import API from '../../api/axios';

const StarSelect = ({ value, onChange }) => (
  <div style={{ display: 'flex', gap: '4px' }}>
    {[1,2,3,4,5].map(n => (
      <span key={n} onClick={() => onChange(n)}
        style={{ fontSize: '22px', cursor: 'pointer', color: n <= value ? '#f59e0b' : '#e2e8f0', transition: 'color 0.1s' }}>
        ★
      </span>
    ))}
  </div>
);

const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [myRatings, setMyRatings] = useState({});
  const [search, setSearch] = useState({ name: '', address: '' });
  const [ratingInput, setRatingInput] = useState({});
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    const [storesRes, ratingsRes] = await Promise.all([
      API.get('/stores', { params: search }),
      API.get('/ratings/my'),
    ]);
    setStores(storesRes.data);
    const map = {};
    ratingsRes.data.forEach(r => { map[r.store_id] = r; });
    setMyRatings(map);
  };

  useEffect(() => { fetchData(); }, []);

  const handleRate = async (storeId) => {
    const value = ratingInput[storeId];
    if (!value) { setMessage('Please select a star rating first.'); return; }
    try {
      const existing = myRatings[storeId];
      if (existing) await API.put(`/ratings/${existing.id}`, { value });
      else await API.post('/ratings', { store_id: storeId, value });
      setMessage('Rating saved successfully!');
      fetchData();
      setRatingInput({ ...ratingInput, [storeId]: 0 });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to save rating.');
    }
  };

  const renderStars = (count) => '★'.repeat(count) + '☆'.repeat(5 - count);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>All Stores</h1>
        <span style={styles.count}>{stores.length} stores</span>
      </div>

      {message && <div style={styles.toast}>{message}</div>}

      <div style={styles.searchBar}>
        <input style={styles.searchInput} placeholder="🔍  Search by store name..."
          value={search.name} onChange={e => setSearch({ ...search, name: e.target.value })} />
        <input style={styles.searchInput} placeholder="📍  Search by address..."
          value={search.address} onChange={e => setSearch({ ...search, address: e.target.value })} />
        <button style={styles.searchBtn} onClick={fetchData}>Search</button>
        <button style={styles.clearBtn} onClick={() => { setSearch({ name: '', address: '' }); fetchData(); }}>Clear</button>
      </div>

      <div style={styles.grid}>
        {stores.map(store => {
          const myRating = myRatings[store.id];
          const inputVal = ratingInput[store.id] || 0;
          return (
            <div key={store.id} style={styles.card}>
              <div style={styles.cardTop}>
                <h3 style={styles.storeName}>{store.name}</h3>
                <div style={styles.overallRating}>
                  {store.avgRating
                    ? <><span style={styles.starGold}>★</span><strong>{store.avgRating}</strong></>
                    : <span style={styles.noRating}>Not rated yet</span>}
                </div>
              </div>
              <p style={styles.address}>📍 {store.address}</p>
              {myRating && (
                <div style={styles.myRatingBadge}>
                  Your rating: <span style={{ color: '#f59e0b' }}>{renderStars(myRating.value)}</span>
                </div>
              )}
              <div style={styles.divider} />
              <div style={styles.rateSection}>
                <p style={styles.rateLabel}>{myRating ? 'Update your rating:' : 'Rate this store:'}</p>
                <StarSelect value={inputVal} onChange={(v) => setRatingInput({ ...ratingInput, [store.id]: v })} />
                <button style={{ ...styles.rateBtn, opacity: inputVal ? 1 : 0.5 }}
                  onClick={() => handleRate(store.id)}>
                  {myRating ? 'Update Rating' : 'Submit Rating'}
                </button>
              </div>
            </div>
          );
        })}
        {stores.length === 0 && (
          <div style={styles.empty}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏪</div>
            <p>No stores found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '32px', maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' },
  title: { fontSize: '26px', fontWeight: '700', color: '#1e293b', margin: 0 },
  count: { background: '#e2e8f0', color: '#475569', fontSize: '13px', padding: '3px 10px', borderRadius: '20px' },
  toast: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '10px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' },
  searchBar: { display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap', background: '#fff', padding: '16px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  searchInput: { flex: 1, minWidth: '180px', padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', color: '#374151' },
  searchBtn: { padding: '9px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
  clearBtn: { padding: '9px 16px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  card: { background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' },
  storeName: { fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: 0, flex: 1, marginRight: '8px' },
  overallRating: { display: 'flex', alignItems: 'center', gap: '4px', background: '#fffbeb', padding: '4px 10px', borderRadius: '20px', fontSize: '14px', whiteSpace: 'nowrap' },
  starGold: { color: '#f59e0b', fontSize: '14px' },
  noRating: { color: '#94a3b8', fontSize: '12px' },
  address: { color: '#64748b', fontSize: '12px', margin: '0 0 10px' },
  myRatingBadge: { background: '#f0fdf4', color: '#15803d', fontSize: '12px', padding: '5px 10px', borderRadius: '6px', marginBottom: '10px' },
  divider: { borderTop: '1px solid #f1f5f9', margin: '12px 0' },
  rateSection: { display: 'flex', flexDirection: 'column', gap: '10px' },
  rateLabel: { fontSize: '12px', color: '#64748b', margin: 0, fontWeight: '500' },
  rateBtn: { background: '#4f46e5', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '7px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', width: 'fit-content' },
  empty: { gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8', padding: '60px 0' },
};

export default UserStores;