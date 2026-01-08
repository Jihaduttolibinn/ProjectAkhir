import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); window.location.reload(); };

    return (
        <nav style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', background: 'var(--bg-glass)', backdropFilter: 'blur(10px)' }}>
            <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>LibAPI</Link>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
                {user ? (
                    <>
                        <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
                        <button onClick={handleLogout} className="btn-primary" style={{ padding: '0.4rem 0.8rem' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
                        <Link to="/register" className="btn-primary" style={{ padding: '0.4rem 0.8rem', textDecoration: 'none' }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};
export default Navbar;
