const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const crypto = require('crypto');

router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const apiKey = crypto.randomBytes(24).toString('hex');
        await db.execute('INSERT INTO users (username, password, role, api_key) VALUES (?, ?, ?, ?)', [username, hashedPassword, role || 'user', apiKey]);
        res.status(201).json({ message: 'User registered', apiKey });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) return res.status(404).json({ message: 'User not found' });
        const user = users[0];
        if (!(await bcrypt.compare(password, user.password))) return res.status(400).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

// route management API keys
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/keys', authMiddleware, async (req, res) => {
    try {
        const [keys] = await db.execute('SELECT * FROM api_keys WHERE user_id = ?', [req.user.id]);
        res.json(keys);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/keys', authMiddleware, async (req, res) => {
    const { type } = req.body; // 'Internal' atau 'External'
    if (!type || !['Internal', 'External'].includes(type)) {
        return res.status(400).json({ message: 'Tipe kunci tidak valid' });
    }

    try {
        const newKey = crypto.randomBytes(24).toString('hex');

        // Hapus hanya key lama dengan tipe yang sama untuk user ini
        await db.execute('DELETE FROM api_keys WHERE user_id = ? AND key_name = ?', [req.user.id, type]);

        // Simpan key baru
        await db.execute('INSERT INTO api_keys (user_id, key_name, api_key) VALUES (?, ?, ?)', [req.user.id, type, newKey]);

        // SINKRONISASI: Jika yang digenerate adalah Internal, update juga tabel users
        if (type === 'Internal') {
            await db.execute('UPDATE users SET api_key = ? WHERE id = ?', [newKey, req.user.id]);
        }

        res.status(201).json({
            message: `${type} API Key berhasil dibuat`,
            apiKey: newKey,
            type
        });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/keys/:id', authMiddleware, async (req, res) => {
    try {
        await db.execute('DELETE FROM api_keys WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ message: 'API Key deleted' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
