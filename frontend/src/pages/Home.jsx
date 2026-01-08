import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1 style={{ fontSize: '3rem', background: 'linear-gradient(to right, #00f2fe, #4facfe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>Library Open API</h1>
        <p style={{ color: 'var(--text-dim)', marginBottom: '3rem' }}>Akses data perpustakaan dengan mudah melalui API modern kami.</p>
        <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>Dapatkan API Key Gratis</Link>
    </div>
);
export default Home;
