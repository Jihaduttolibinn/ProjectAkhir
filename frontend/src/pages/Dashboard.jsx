import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [testResult, setTestResult] = useState(null);

    const testAPI = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/books');
            setTestResult(JSON.stringify(res.data.slice(0, 2), null, 2));
            setBooks(res.data);
        } catch (err) {
            setTestResult('Error fetching: ' + err.message);
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '2rem', color: 'var(--primary)' }}>User Dashboard</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="glass-card">
                    <h3 style={{ marginBottom: '1rem' }}>Your API Credentials</h3>
                    <div className="input-group">
                        <label>Your API Key</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input type="text" readOnly value={user?.apiKey} style={{ flex: 1 }} />
                            <button className="btn-primary" onClick={() => navigator.clipboard.writeText(user?.apiKey)}>Copy</button>
                        </div>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '1rem' }}>
                        Gunakan API Key ini di header <code>x-api-key</code> untuk mengakses endpoint publik.
                    </p>
                </div>

                <div className="glass-card">
                    <h3 style={{ marginBottom: '1rem' }}>API Sandbox</h3>
                    <p style={{ marginBottom: '1rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                        Coba panggil endpoint <code>GET /api/books</code> untuk melihat daftar buku.
                    </p>
                    <button className="btn-primary" onClick={testAPI} disabled={loading}>
                        {loading ? 'Fetching...' : 'Test Get Books'}
                    </button>
                    {testResult && (
                        <pre style={{ marginTop: '1rem', padding: '1rem', background: '#1e293b', borderRadius: '8px', fontSize: '0.8rem', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.1)' }}>
                            {testResult}
                        </pre>
                    )}
                </div>
            </div>

            <h3 style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>Daftar Buku (Preview Luas)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {books.length > 0 ? books.map(book => (
                    <div key={book.id} className="glass-card" style={{ padding: '1rem' }}>
                        <h4 style={{ color: 'var(--primary)' }}>{book.title}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>by {book.author}</p>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{book.description}</p>
                    </div>
                )) : (
                    <p style={{ color: 'var(--text-dim)' }}>Klik 'Test Get Books' untuk memuat data.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
