// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const properties = require(`../properties/properties.json`);
const environment = properties.env.environment || 'development';
const config = require(`../config/config.${environment}.json`);

// Verify token middleware
exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    jwt.verify(token, config.auth.secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        // Attach roleId and userId to the request object for further processing
        req.roleId = decoded.roleid;
        req.userId = decoded.id;

        next();
    });
};
