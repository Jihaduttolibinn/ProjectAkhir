const jwt = require('jsonwebtoken');
const db = require('../config/db');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
    catch (e) { res.status(401).json({ message: 'Invalid token' }); }
};

const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    next();
};

const apiKeyMiddleware = (type) => async (req, res, next) => {
    const apiKey = req.header('x-api-key');
    if (!apiKey) return res.status(401).json({ message: 'API Key is required' });

    try {
        const [keys] = await db.execute('SELECT * FROM api_keys WHERE api_key = ? AND key_name = ?', [apiKey, type]);
        if (keys.length === 0) return res.status(401).json({ message: `Invalid API Key for ${type} Access` });

        req.apiKeyOwnerId = keys[0].user_id;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { authMiddleware, adminMiddleware, apiKeyMiddleware };
