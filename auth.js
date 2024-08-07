const jwt = require("jsonwebtoken");
require('dotenv').config();

module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    };
    return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
};

module.exports.verify = (req, res, next) => {
    let token = req.headers.authorization;

    if (typeof token === "undefined") {
        return res.status(401).send({ auth: "Failed. No Token" });
    } else {
        token = token.slice(7, token.length);

        jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decodedToken) {
            if (err) {
                return res.status(403).send({
                    auth: "Failed",
                    message: err.message
                });
            } else {
                console.log('Decoded Token:', decodedToken);
                req.user = decodedToken;
                next();
            }
        });
    }
};

module.exports.errorHandler = (err, req, res, next) => {
    console.error(err);

    const errorMessage = err.message || 'Internal Server Error';
    const statusCode = err.status || 500;

    res.status(statusCode).json({
        error: {
            message: errorMessage,
            errorCode: err.code || 'SERVER_ERROR',
            details: err.details || null
        }
    });
};

module.exports.verifyAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return res.status(403).send({
            auth: "Failed",
            message: "Action Forbidden",
        });
    }
};

module.exports.notAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin===false) {
        next();
    } else {
        return res.status(403).send({
            auth: "Failed",
            message: "Action Forbidden",
        });
    }
};

module.exports.isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
};
