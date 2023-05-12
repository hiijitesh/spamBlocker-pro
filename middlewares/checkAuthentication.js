require('dotenv').config();

const jwt = require('jsonwebtoken');

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

function checkAuthentication(req, res, next) {
	const authorizationToken = req.headers.authorization;

	let token;

	if (authorizationToken) {
		token = authorizationToken.split(' ')[1];
	}

	if (!token) {
		return res.status(401).json({
			error: 'You are not authorized',
		});
	}

	const decoded = verifyToken(token);

	if (Object.keys(decoded).length === 0) {
		return res.status(401).json({
			message: 'Unauthorized',
		});
	}

	req.userInfo = decoded;
	next();
}

module.exports = checkAuthentication;
