import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [form, setForm] = useState({ username: '', password: '', role: 'user' });
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', form);
            navigate('/login');
        } catch (err) { alert('Register failed'); }
    };
    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
            <div className="glass-card" style={{ width: '400px' }}>
                <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Username</label>
                        <input type="text" onChange={e => setForm({ ...form, username: e.target.value })} required />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" onChange={e => setForm({ ...form, password: e.target.value })} required />
                    </div>
                    <div className="input-group">
                        <label>Role</label>
                        <select onChange={e => setForm({ ...form, role: e.target.value })}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>Register</button>
                </form>
            </div>
        </div>
    );
};
export default Register;
