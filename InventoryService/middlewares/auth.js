const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {    
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: 'You are unauthorized !' });
    try {
        const decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
        req.user = decoded;
        next();
    } catch (e) {
        return res.status(403).json({ message: 'Invalid or expired access token !' });
    }
}

module.exports = authMiddleware;