const express = require('express');

const checkAuthentication = require('../middlewares/checkAuthentication');
const authenticationController = require('../controllers/authenticationController');

const router = express.Router();

router.post('/signup', authenticationController.userSignup);

router.post('/login', authenticationController.userLogin);

router.post('/logout', authenticationController.userLogout);

router.post('/get-access-token', authenticationController.getAccessToken);

router.post(
	'/add-user-email',
	checkAuthentication,
	authenticationController.addUserEmail
);

module.exports = router;
