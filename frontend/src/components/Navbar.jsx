import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-glass)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
            <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', textDecoration: 'none' }}>
                LibAPI
            </Link>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Home</Link>
                {user ? (
                    <>
                        <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Dashboard</Link>
                        <button onClick={handleLogout} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Login</Link>
                        <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
