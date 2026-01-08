const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Get all books (Public/User)
router.get('/', async (req, res) => {
    try {
        const [books] = await db.execute('SELECT * FROM books');
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get book by ID
router.get('/:id', async (req, res) => {
    try {
        const [books] = await db.execute('SELECT * FROM books WHERE id = ?', [req.params.id]);
        if (books.length === 0) return res.status(404).json({ message: 'Book not found' });
        res.json(books[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create Book (Admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    const { title, author, description, category, image_url } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO books (title, author, description, category, image_url) VALUES (?, ?, ?, ?, ?)',
            [title, author, description, category, image_url]
        );
        res.status(201).json({ message: 'Book created', bookId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Book (Admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { title, author, description, category, image_url } = req.body;
    try {
        await db.execute(
            'UPDATE books SET title=?, author=?, description=?, category=?, image_url=? WHERE id=?',
            [title, author, description, category, image_url, req.params.id]
        );
        res.json({ message: 'Book updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Book (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await db.execute('DELETE FROM books WHERE id = ?', [req.params.id]);
        res.json({ message: 'Book deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
