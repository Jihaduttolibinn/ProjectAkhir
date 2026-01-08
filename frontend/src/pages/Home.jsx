import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Library Open API Platform
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-dim)', maxWidth: '800px', margin: '0 auto 3rem auto', lineHeight: '1.6' }}>
                Akses ribuan data buku berkualitas melalui API kami yang cepat dan mudah digunakan.
                Dibuat untuk pengembang, oleh pecinta buku.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
                <div className="glass-card">
                    <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Sangat Cepat</h3>
                    <p style={{ color: 'var(--text-dim)' }}>Dapatkan data buku dalam milidetik dengan infrastruktur cloud kami yang optimal.</p>
                </div>
                <div className="glass-card">
                    <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Mudah Digunakan</h3>
                    <p style={{ color: 'var(--text-dim)' }}>Dokumentasi API yang lengkap dan contoh kode untuk berbagai bahasa pemrograman.</p>
                </div>
                <div className="glass-card">
                    <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Gratis untuk Developer</h3>
                    <p style={{ color: 'var(--text-dim)' }}>Mulai kembangkan aplikasi perpusatakaan impian Anda tanpa biaya awal.</p>
                </div>
            </div>

            <div style={{ marginTop: '4rem' }}>
                <Link to="/register" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', textDecoration: 'none' }}>
                    Dapatkan API Key Gratis
                </Link>
            </div>
        </div>
    );
};

export default Home;
