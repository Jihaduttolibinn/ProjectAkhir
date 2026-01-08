import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [books, setBooks] = useState([]);
    const [form, setForm] = useState({ title: '', author: '', description: '', category: '', image_url: '' });
    const [editingId, setEditingId] = useState(null);
    const token = localStorage.getItem('token');

    const fetchBooks = async () => {
        const res = await axios.get('http://localhost:5000/api/books');
        setBooks(res.data);
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/api/books/${editingId}`, form, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('http://localhost:5000/api/books', form, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setForm({ title: '', author: '', description: '', category: '', image_url: '' });
            setEditingId(null);
            fetchBooks();
        } catch (err) {
            alert('Error saving book: ' + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            await axios.delete(`http://localhost:5000/api/books/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchBooks();
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '2rem', color: 'var(--primary)' }}>Admin - Manajemen Perpustakaan</h2>

            <div className="glass-card" style={{ marginBottom: '3rem' }}>
                <h3>{editingId ? 'Edit Buku' : 'Tambah Buku Baru'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                    <div className="input-group">
                        <label>Judul Buku</label>
                        <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                    </div>
                    <div className="input-group">
                        <label>Penulis</label>
                        <input type="text" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required />
                    </div>
                    <div className="input-group">
                        <label>Kategori</label>
                        <input type="text" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                    </div>
                    <div className="input-group">
                        <label>URL Gambar</label>
                        <input type="text" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
                    </div>
                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                        <label>Deskripsi</label>
                        <textarea
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            style={{ width: '100%', padding: '0.8rem', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', minHeight: '100px' }}
                        />
                    </div>
                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="btn-primary" style={{ flex: 1 }}>{editingId ? 'Simpan Perubahan' : 'Tambah Buku'}</button>
                        {editingId && <button onClick={() => { setEditingId(null); setForm({ title: '', author: '', description: '', category: '', image_url: '' }); }} className="btn-primary" style={{ background: 'var(--accent)', flex: 1 }}>Batal</button>}
                    </div>
                </form>
            </div>

            <div className="glass-card">
                <h3>Daftar Buku Terdaftar</h3>
                <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '1rem' }}>Judul</th>
                                <th style={{ padding: '1rem' }}>Penulis</th>
                                <th style={{ padding: '1rem' }}>Kategori</th>
                                <th style={{ padding: '1rem' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map(book => (
                                <tr key={book.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>{book.title}</td>
                                    <td style={{ padding: '1rem' }}>{book.author}</td>
                                    <td style={{ padding: '1rem' }}>{book.category}</td>
                                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => { setEditingId(book.id); setForm(book); }} style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid var(--primary)', background: 'transparent', color: 'var(--primary)', cursor: 'pointer' }}>Edit</button>
                                        <button onClick={() => handleDelete(book.id)} style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid var(--accent)', background: 'transparent', color: 'var(--accent)', cursor: 'pointer' }}>Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
