import React, { useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [books, setBooks] = useState([]);
    const testAPI = async () => {
        const res = await axios.get('http://localhost:5000/api/books');
        setBooks(res.data);
    };
    return (
        <div style={{ padding: '2rem 0' }}>
            <div className="glass-card" style={{ marginBottom: '2rem' }}>
                <h3>API Credentials</h3>
                <p style={{ color: 'var(--text-dim)', marginTop: '0.5rem' }}>API Key: <code>{user?.apiKey}</code></p>
            </div>
            <button onClick={testAPI} className="btn-primary">Load Books</button>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                {books.map(b => (
                    <div key={b.id} className="glass-card">
                        <h4>{b.title}</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>{b.author}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Dashboard;
