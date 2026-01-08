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
        res.json({ token, user: { id: user.id, username: user.username, role: user.role, apiKey: user.api_key } });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
