const userStore = require('../config/userStore');
const config = require('../config/config');
const jwt = require('jsonwebtoken');

module.exports.isAuthenticated = function(req, res, next) {
    var token = req.headers['x-access-token'];
    if(!token) {
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
            console.log(err);
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }
        if(decoded.username === userStore.user.username) {
            req.user = userStore.user;
            return next();
        }
        return res.status(404).send("No user found.");
    });
}