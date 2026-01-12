import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const [booksInternal, setBooksInternal] = useState([]);
    const [booksExternal, setBooksExternal] = useState([]);
    const [apiKeys, setApiKeys] = useState([]);
    const [inputApiKeyInternal, setInputApiKeyInternal] = useState('');
    const [inputApiKeyExternal, setInputApiKeyExternal] = useState('');
    const [loadingInternal, setLoadingInternal] = useState(false);
    const [loadingExternal, setLoadingExternal] = useState(false);

    const fetchKeys = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/auth/keys', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setApiKeys(res.data);
        } catch (err) { console.error(err); }
    };

    const generateKey = async (type) => {
        try {
            await axios.post('http://localhost:5000/api/auth/keys', { type }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchKeys();
        } catch (err) { alert(`Gagal membuat ${type} Key`); }
    };

    const testInternalAPI = async () => {
        if (!inputApiKeyInternal) return alert('Silakan masukkan API Key di Sandbox Internal!');
        setLoadingInternal(true);
        try {
            const res = await axios.get('http://localhost:5000/api/books/public', {
                headers: { 'x-api-key': inputApiKeyInternal }
            });
            setBooksInternal(res.data);
        } catch (err) {
            alert('Internal API Gagal! Pastikan kamu pakai Key Internal ya bro.');
            setBooksInternal([]);
        }
        setLoadingInternal(false);
    };

    const testExternalAPI = async () => {
        if (!inputApiKeyExternal) return alert('Silakan masukkan API Key di Sandbox Eksternal!');
        setLoadingExternal(true);
        try {
            const res = await axios.get('http://localhost:5000/api/books/external', {
                headers: { 'x-api-key': inputApiKeyExternal }
            });
            setBooksExternal(res.data);
        } catch (err) {
            alert('External API Gagal! Pastikan kamu pakai Key Eksternal ya bro.');
            setBooksExternal([]);
        }
        setLoadingExternal(false);
    };

    useEffect(() => {
        fetchKeys();
    }, []);

    const internalKeyObj = apiKeys.find(k => k.key_name === 'Internal');
    const externalKeyObj = apiKeys.find(k => k.key_name === 'External');

    return (
        <div className="dashboard-container" style={{ padding: '2rem 0' }}>
            {/* Profil & API Keys */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                <div className="glass-card key-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className="status-badge" style={{ alignSelf: 'flex-start', marginBottom: '1rem', color: 'var(--secondary)' }}>Profile Status</div>
                    <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1.8rem' }}>Welcome Back, {user?.username}!</h3>
                    <p style={{ color: 'var(--text-dim)', fontSize: '1rem' }}>You are logged in as <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>{user?.role}</span></p>
                </div>

                <div className="glass-card key-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ color: 'var(--primary)', margin: 0, fontSize: '1.4rem' }}>API Key Management 🔑</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        {/* Internal Key Display */}
                        <div className="key-display" style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0, 243, 255, 0.2)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--secondary)', letterSpacing: '1px' }}>PROJECT API KEY</span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => generateKey('Internal')} className="generate-btn" style={{ background: 'var(--secondary)', border: 'none', color: '#0f172a', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 'bold' }}>Regenerate</button>
                                    <button onClick={() => { if (internalKeyObj) { navigator.clipboard.writeText(internalKeyObj.api_key); alert('Internal Key Copied!'); } }} style={{ background: 'transparent', border: '1px solid var(--secondary)', color: 'var(--secondary)', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.65rem' }}>Copy</button>
                                </div>
                            </div>
                            <code style={{ fontSize: '0.85rem', color: '#fff', wordBreak: 'break-all', opacity: internalKeyObj ? 1 : 0.5 }}>{internalKeyObj ? internalKeyObj.api_key : 'No key generated yet...'}</code>
                        </div>

                        {/* External Key Display */}
                        <div className="key-display" style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255, 0, 110, 0.2)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--accent)', letterSpacing: '1px' }}>EXTERNAL API KEY</span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => generateKey('External')} className="generate-btn" style={{ background: 'var(--accent)', border: 'none', color: '#fff', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 'bold' }}>Regenerate</button>
                                    <button onClick={() => { if (externalKeyObj) { navigator.clipboard.writeText(externalKeyObj.api_key); alert('External Key Copied!'); } }} style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.65rem' }}>Copy</button>
                                </div>
                            </div>
                            <code style={{ fontSize: '0.85rem', color: '#fff', wordBreak: 'break-all', opacity: externalKeyObj ? 1 : 0.5 }}>{externalKeyObj ? externalKeyObj.api_key : 'No key generated yet...'}</code>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dua Sandbox Sandbox Side by Side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                {/* Sandbox API Internal */}
                <div className="glass-card sandbox-card">
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <div className="status-badge" style={{ display: 'inline-block', marginBottom: '0.8rem', color: 'var(--secondary)' }}>Internal Database</div>
                        <h3 style={{ margin: 0, color: 'var(--secondary)', fontSize: '1.4rem' }}>Main API Sandbox 🚀</h3>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Test your credentials against your library database.</p>
                    </div>

                    <div className="input-group" style={{ marginBottom: '1rem' }}>
                        <input
                            type="text"
                            className="api-input"
                            placeholder="Paste Internal Key here..."
                            value={inputApiKeyInternal}
                            onChange={e => setInputApiKeyInternal(e.target.value)}
                            style={{ textAlign: 'center', borderRadius: '12px' }}
                        />
                    </div>

                    <button onClick={testInternalAPI} className="btn-primary" disabled={loadingInternal} style={{ borderRadius: '12px', padding: '1rem' }}>
                        {loadingInternal ? 'Connecting to Project API...' : 'Fetch Project Books'}
                    </button>

                    <div className="custom-scrollbar" style={{ marginTop: '2rem', display: 'grid', gap: '1rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '8px' }}>
                        {booksInternal.length > 0 ? booksInternal.map(b => (
                            <div key={b.id} className="book-item" style={{ display: 'flex', gap: '15px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', alignItems: 'center' }}>
                                <img src={b.image_url} alt={b.title} className="book-img" style={{ width: '50px', height: '70px', objectFit: 'cover', borderRadius: '6px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} />
                                <div>
                                    <h5 style={{ margin: 0, color: 'var(--primary)', fontSize: '1rem' }}>{b.title}</h5>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: '4px 0' }}>by {b.author}</p>
                                    <span style={{ fontSize: '0.65rem', background: 'rgba(0, 242, 254, 0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px' }}>{b.category}</span>
                                </div>
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📡</div>
                                <p style={{ fontSize: '0.85rem' }}>No data fetched yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sandbox API Eksternal */}
                <div className="glass-card sandbox-card" style={{ borderTop: '3px solid var(--accent)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <div className="status-badge" style={{ display: 'inline-block', marginBottom: '0.8rem', color: 'var(--accent)' }}>Global Library API</div>
                        <h3 style={{ margin: 0, color: 'var(--accent)', fontSize: '1.4rem' }}>Simulated External API 🌐</h3>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Explore content from the third-party providers cluster.</p>
                    </div>

                    <div className="input-group" style={{ marginBottom: '1rem' }}>
                        <input
                            type="text"
                            className="api-input"
                            placeholder="Paste External Key here..."
                            value={inputApiKeyExternal}
                            onChange={e => setInputApiKeyExternal(e.target.value)}
                            style={{ textAlign: 'center', borderRadius: '12px', borderColor: 'rgba(255, 0, 110, 0.2)' }}
                        />
                    </div>

                    <button onClick={testExternalAPI} className="btn-primary" disabled={loadingExternal} style={{ borderRadius: '12px', padding: '1rem', background: 'linear-gradient(135deg, var(--accent), #ff006e)' }}>
                        {loadingExternal ? 'Accessing Global Cluster...' : 'Fetch External Books'}
                    </button>

                    <div className="custom-scrollbar" style={{ marginTop: '2rem', display: 'grid', gap: '1rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '8px' }}>
                        {booksExternal.length > 0 ? booksExternal.map(b => (
                            <div key={b.id} className="book-item" style={{ display: 'flex', gap: '15px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', alignItems: 'center' }}>
                                <img src={b.image_url} alt={b.title} className="book-img" style={{ width: '50px', height: '70px', objectFit: 'cover', borderRadius: '6px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} />
                                <div>
                                    <h5 style={{ margin: 0, color: 'var(--accent)', fontSize: '1rem' }}>{b.title}</h5>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: '4px 0' }}>by {b.author}</p>
                                    <span style={{ fontSize: '0.65rem', background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent)', padding: '2px 8px', borderRadius: '4px' }}>{b.category}</span>
                                </div>
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌍</div>
                                <p style={{ fontSize: '0.85rem' }}>Waiting for global request.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};
export default Dashboard;
