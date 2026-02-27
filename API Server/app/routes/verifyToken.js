const jwt = require('jsonwebtoken');

const isAuth = function (req, res, next) {
    const token = req.headers('auth-token');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        console.log("Am i admin ? " + req.user.isAdmin);
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

const isAdmin = function (req, res, next) {
    if (req.user.isAdmin) return res.status(403).send('Access Denied');
        next();
};

module.exports = {
    isAuth,
    isAdmin
}