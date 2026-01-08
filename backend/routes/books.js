const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
    try { const [books] = await db.execute('SELECT * FROM books'); res.json(books); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    const { title, author, description, category } = req.body;
    try {
        const [result] = await db.execute('INSERT INTO books (title, author, description, category) VALUES (?, ?, ?, ?)', [title, author, description, category]);
        res.status(201).json({ message: 'Book created', id: result.insertId });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { title, author, description, category } = req.body;
    try {
        await db.execute('UPDATE books SET title=?, author=?, description=?, category=? WHERE id=?', [title, author, description, category, req.params.id]);
        res.json({ message: 'Book updated' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try { await db.execute('DELETE FROM books WHERE id = ?', [req.params.id]); res.json({ message: 'Book deleted' }); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
