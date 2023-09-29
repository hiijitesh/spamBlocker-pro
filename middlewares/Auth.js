require("dotenv").config();
const jwt = require("jsonwebtoken");

function verifyToken(jwt_token) {
    let decoded = {};

    jwt.verify(jwt_token, process.env.ACCESS_TOKEN, (err, paramdecoded) => {
        if (err) {
            return;
        }
        decoded = paramdecoded;
    });
    return decoded;
}

function isAuthenticated(req, res, next) {
    const authorizationToken = req.headers.authorization;

    let token;

    if (authorizationToken) {
        token = authorizationToken.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({
            error: "Please provide valid token",
        });
    }

    const decoded = verifyToken(token);

    if (Object.keys(decoded).length === 0) {
        return res.status(401).json({
            message: "Unauthorized Access",
        });
    }

    req.userInfo = decoded;
    next();
}

module.exports = isAuthenticated;
