const userStore = require('../config/userStore');
const config = require('../config/config');
const jwt = require('jsonwebtoken');

exports.loginUser = function(req, res) {
    var user = userStore.user;
    var providedUsername = req.body.username;
    var providedPassword = req.body.password;
    if((user.username === providedUsername) && (user.password === providedPassword)) {
        var token = jwt.sign({ username: user.username }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        return res.json({ 
            success: true, 
            token: token, 
            message: 'Successfully logged in.',
            user: {
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                avatar: user.avatar
            }
        });
    }
    return res.json({success: false, message: 'Please enter valid credentials.'});
}

exports.userProfile = function(req, res) {
    var user = req.user;
    res.status(200).json({
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        avatar: user.avatar
    });
}