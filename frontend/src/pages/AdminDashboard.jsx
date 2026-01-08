import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [books, setBooks] = useState([]);
    const [form, setForm] = useState({ title: '', author: '', description: '', category: '' });
    const token = localStorage.getItem('token');
    const fetchBooks = async () => { const res = await axios.get('http://localhost:5000/api/books'); setBooks(res.data); };
    useEffect(() => { fetchBooks(); }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/books', form, { headers: { Authorization: `Bearer ${token}` } });
            setForm({ title: '', author: '', description: '', category: '' }); fetchBooks();
        } catch (err) { alert('Error'); }
    };
    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/books/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchBooks();
    };
    return (
        <div style={{ padding: '2rem 0' }}>
            <div className="glass-card" style={{ marginBottom: '2rem' }}>
                <h3>Add New Book</h3>
                <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
                    <input style={{ marginBottom: '10px' }} placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /><br />
                    <input style={{ marginBottom: '10px' }} placeholder="Author" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required /><br />
                    <button className="btn-primary">Add Book</button>
                </form>
            </div>
            <div className="glass-card">
                <h3>Manage Books</h3>
                {books.map(b => (
                    <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <span>{b.title} - {b.author}</span>
                        <button onClick={() => handleDelete(b.id)} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default AdminDashboard;
