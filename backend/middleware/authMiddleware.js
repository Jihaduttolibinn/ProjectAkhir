const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied, admin only' });
    }
    next();
};

const apiKeyMiddleware = async (req, res, next) => {
    const apiKey = req.header('x-api-key');
    if (!apiKey) return res.status(401).json({ message: 'API Key is required' });

    try {
        const [users] = await db.execute('SELECT * FROM users WHERE api_key = ?', [apiKey]);
        if (users.length === 0) return res.status(401).json({ message: 'Invalid API Key' });
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { authMiddleware, adminMiddleware, apiKeyMiddleware };
