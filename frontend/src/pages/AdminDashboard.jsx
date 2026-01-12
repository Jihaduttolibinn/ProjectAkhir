import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [books, setBooks] = useState([]);
    const [form, setForm] = useState({ title: '', author: '', description: '', category: '', image_url: '' });
    const [imageFile, setImageFile] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const token = localStorage.getItem('token');

    const fetchBooks = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/books');
            setBooks(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('author', form.author);
        formData.append('description', form.description);
        formData.append('category', form.category);
        formData.append('image_url', form.image_url);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/api/books/${editingId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                await axios.post('http://localhost:5000/api/books', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            setForm({ title: '', author: '', description: '', category: '', image_url: '' });
            setImageFile(null);
            setEditingId(null);
            // Reset file input manual
            document.getElementById('fileInput').value = '';
            fetchBooks();
        } catch (err) { alert('Gagal menyimpan buku'); }
    };

    const handleEdit = (book) => {
        setEditingId(book.id);
        setForm({
            title: book.title,
            author: book.author,
            description: book.description || '',
            category: book.category || '',
            image_url: book.image_url || ''
        });
        setImageFile(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Hapus buku ini?')) {
            try {
                await axios.delete(`http://localhost:5000/api/books/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchBooks();
            } catch (err) { alert('Gagal menghapus'); }
        }
    };

    return (
        <div style={{ padding: '2rem 0' }}>
            <div className="glass-card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>
                    {editingId ? 'Edit Buku' : 'Tambah Buku Baru'}
                </h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="input-group">
                        <label>Judul Buku</label>
                        <input type="text" placeholder="Masukkan judul" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                    </div>
                    <div className="input-group">
                        <label>Penulis</label>
                        <input type="text" placeholder="Nama penulis" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required />
                    </div>
                    <div className="input-group">
                        <label>Kategori</label>
                        <input type="text" placeholder="Contoh: Programming" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                    </div>
                    <div className="input-group">
                        <label>Upload Foto (Dari Laptop)</label>
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            onChange={e => setImageFile(e.target.files[0])}
                            style={{ padding: '0.5rem' }}
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>*Atau masukkan URL di bawah jika tidak upload</p>
                    </div>
                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                        <label>URL Gambar (Opsional)</label>
                        <input type="text" placeholder="https://..." value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
                    </div>
                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                        <label>Deskripsi</label>
                        <textarea
                            placeholder="Tulis deskripsi buku..."
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            style={{ minHeight: '100px' }}
                        />
                    </div>
                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                            {editingId ? 'Simpan Perubahan' : 'Tambah Buku'}
                        </button>
                        {editingId && (
                            <button onClick={() => { setEditingId(null); setForm({ title: '', author: '', description: '', category: '', image_url: '' }); setImageFile(null); }} className="btn-primary" style={{ background: 'var(--accent)', flex: 1 }}>
                                Batal
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="glass-card">
                <h3 style={{ marginBottom: '1.5rem' }}>Daftar Buku Terdaftar</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {books.map(b => (
                        <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                {b.image_url && <img src={b.image_url} alt={b.title} style={{ width: '40px', height: '60px', borderRadius: '4px', objectFit: 'cover' }} />}
                                <div>
                                    <h4 style={{ color: 'var(--primary)' }}>{b.title}</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{b.author} | {b.category || 'Tanpa Kategori'}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => handleEdit(b)} style={{ color: 'var(--primary)', background: 'none', border: '1px solid var(--primary)', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                                <button onClick={() => handleDelete(b.id)} style={{ color: 'var(--accent)', background: 'none', border: '1px solid var(--accent)', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' }}>Hapus</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default AdminDashboard;
