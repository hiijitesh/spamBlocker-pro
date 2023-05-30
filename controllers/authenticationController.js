<<<<<<< HEAD
require("dotenv").config()

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const helper = require("../helpers/helper")

const { db } = require("../database/dbConfig")
=======
require('dotenv').config()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// to validate email, phone, password
const helper = require('../helpers/validator.helper')

// DB instance of mysql
const { db } = require('../database/db_config')
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
const User = db.user
const JWTRefreshToken = db.refreshtoken

// This function is used for generating or signing JWT token.
function generateJWTToken(user, token_type) {
	let jwt_token

<<<<<<< HEAD
	if (token_type === "access") {
=======
	if (token_type === 'access') {
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
		jwt_token = jwt.sign(
			{ phone: user.phone, id: user.id },
			process.env.ACCESS_TOKEN,
			{
<<<<<<< HEAD
				expiresIn: "30m",
=======
				expiresIn: '30m',
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
			}
		)
	} else {
		jwt_token = jwt.sign({ phone: user.phone }, process.env.REFRESH_TOKEN)
	}
	return jwt_token
}

// User signup function
async function userSignup(req, res) {
<<<<<<< HEAD
	let phone = req.body.phone
	let password = req.body.password
	let name = req.body.name
	let email = req.body.email

	if (!name || !password || !phone) {
		res.status(400).json({ error: "Empty Name/Phone/Password." })
=======
	let { phone, password, name, email } = req.body

	if (!name || !password || !phone) {
		res.status(400).json({ error: 'Empty Name/Phone/Password.' })
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
		return
	}

	if (
		!helper.validateName(name) ||
		!helper.validatePhoneNumber(phone) ||
		!helper.validatePassword(password)
	) {
<<<<<<< HEAD
		res.status(400).json({ error: "Invalid Name/Phone/Password." })
=======
		res.status(400).json({ error: 'Invalid Name/Phone/Password.' })
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
		return
	}

	if (email && !helper.validateEmail(email)) {
<<<<<<< HEAD
		res.status(400).json({ error: "Invalid Email." })
		return
	}

	try {
		const existingUser = await User.findOne({ where: { phone } })

		if (existingUser && existingUser.name != "NULL") {
			res.status(400).json({
				error: "Found already existing user with this phone.",
=======
		res.status(400).json({ error: 'Invalid Email.' })
		return
	}

	//check user already have signup
	try {
		const existingUser = await User.findOne({ where: { phone } })

		if (existingUser && existingUser.name != 'NULL') {
			res.status(400).json({
				error: 'Found already existing user with this phone.',
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
			})
			return
		}

<<<<<<< HEAD
=======
		//user is new, hash the password
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
		hashed_password = await bcrypt.hash(password, 10)

		const newUser = {
			name: name,
			phone: phone,
			password: hashed_password,
		}

<<<<<<< HEAD
		if (email) {
			newUser.email = email
		}

		if (existingUser && existingUser.name == "NULL") {
			await User.update(newUser, { where: { id: existingUser.id } })
		} else {
			await User.create(newUser)
		}

		res.status(201).json({ message: "User created successfully" })
	} catch (error) {
		res.status(500).json({ error: "User signup failed." })
=======
		//since email is optional so we can add if email if it does exist
		if (email) {
			newUser.email = email
		}
		//update username of user else create new user
		if (existingUser && existingUser.name == 'NULL') {
			await User.update(newUser, { where: { id: existingUser.id } })
		} else {
			await User.create(newUser)
		}

		res.status(201).json({ message: 'User created successfully' })
	} catch (error) {
		res.status(500).json({ error: 'User signup failed.' })
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
		return
	}
}

// user Login function
async function userLogin(req, res) {
	let phone = req.body.phone
	let password = req.body.password

<<<<<<< HEAD
	if (!phone || !password) {
		res.status(400).json({
			error: "Phone and Password is required for Login.",
=======
	//check phone or password is missing/empty
	if (!phone || !password) {
		res.status(400).json({
			error: 'Phone and Password is required for Login.',
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
		})
		return
	}

<<<<<<< HEAD
=======
	//find user in DB using phone number
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
	try {
		const user = await User.findOne({ where: { phone } })

		if (!user) {
<<<<<<< HEAD
			res.status(400).json({ error: "No user found." })
			return
		}

		const matchPassword = await bcrypt.compare(password, user.password)

		if (!matchPassword) {
			res.status(400).json({ error: "Wrong password." })
			return
		}

		const access_token = generateJWTToken(user, "access")
		const refresh_token = generateJWTToken(user, "refresh")
=======
			res.status(400).json({ error: 'No user found.' })
			return
		}

		//compare the user entered password and DB password of the user
		const matchPassword = await bcrypt.compare(password, user.password)

		if (!matchPassword) {
			res.status(400).json({ error: 'Wrong password.' })
			return
		}

		const access_token = generateJWTToken(user, 'access')
		const refresh_token = generateJWTToken(user, 'refresh')
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
		await JWTRefreshToken.create({ token: refresh_token })

		res.status(200).json({
			access_token,
			refresh_token,
<<<<<<< HEAD
			message: "Login successfull",
		})
	} catch (error) {
		res.status(500).json({ error: "Login failed. Try again!" })
=======
			message: 'Login successfull',
		})
	} catch (error) {
		res.status(500).json({ error: 'Login failed. Try again!' })
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
		return
	}
}

// This endpoint is used to get the access token.
async function getAccessToken(req, res) {
	const refresh_token = req.body.refresh_token

	if (!refresh_token) {
<<<<<<< HEAD
		res.status(400).json({ error: "Refresh token is missing." })
=======
		res.status(400).json({ error: 'Refresh token is missing.' })
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
		return
	}

	try {
		const currentRefreshToken = await JWTRefreshToken.findOne({
			where: { token: refresh_token },
		})

		if (!currentRefreshToken) {
<<<<<<< HEAD
			res.status(400).json({ error: "Invalid refresh token." })
			return
		}

		const new_access_token = generateJWTToken(currentRefreshToken, "access")
=======
			res.status(400).json({ error: 'Invalid refresh token.' })
			return
		}

		const new_access_token = generateJWTToken(currentRefreshToken, 'access')
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a

		res.status(200).json({
			new_access_token,
			refresh_token,
<<<<<<< HEAD
			message: "New access token generation success.",
		})
	} catch (error) {
		res.status(500).json({
			error: "Access token generation failed. Try again!",
=======
			message: 'New access token generation success.',
		})
	} catch (error) {
		res.status(500).json({
			error: 'Access token generation failed. Try again!',
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
		})
		return
	}
}

// This end point is used for userLogout
async function userLogout(req, res) {
	const refresh_token = req.body.refresh_token

	if (!refresh_token) {
<<<<<<< HEAD
		res.status(400).json({ error: "Refresh token is missing." })
=======
		res.status(400).json({ error: 'Refresh token is missing.' })
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
		return
	}

	try {
		const currentRefreshToken = await JWTRefreshToken.findOne({
			where: { token: refresh_token },
		})

		if (!currentRefreshToken) {
<<<<<<< HEAD
			res.status(400).json({ error: "Invalid refresh token." })
=======
			res.status(400).json({ error: 'Invalid refresh token.' })
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
			return
		}

		await currentRefreshToken.destroy()

<<<<<<< HEAD
		res.status(200).json({ message: "Logout successfull" })
	} catch (error) {
		res.status(500).json({ error: "Logout failed. Try again" })
=======
		res.status(200).json({ message: 'Logout successfull' })
	} catch (error) {
		res.status(500).json({ error: 'Logout failed. Try again' })
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
		return
	}
}

//since email was optional so we can add email later on
async function addUserEmail(req, res) {
	const email = req.body.email

	if (!email || !helper.validateEmail(email)) {
<<<<<<< HEAD
		res.status(400).json({ error: "Invalid email address." })
=======
		res.status(400).json({ error: 'Invalid email address.' })
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
		return
	}

	try {
		const existingUser = await User.findOne({
			where: { id: req.userInfo.id },
		})

		if (!existingUser) {
<<<<<<< HEAD
			res.status(400).json({ error: "No user found." })
=======
			res.status(400).json({ error: 'No user found.' })
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
			return
		}

		await User.update({ email }, { where: { id: existingUser.id } })

<<<<<<< HEAD
		res.status(201).json({ message: "Email added succesfully." })
	} catch (error) {
		res.status(500).json({ error: "Adding the email failed. Try again" })
=======
		res.status(201).json({ message: 'Email added succesfully.' })
	} catch (error) {
		res.status(500).json({ error: 'Adding the email failed. Try again' })
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
		return
	}
}

module.exports = {
	userSignup,
	userLogin,
	userLogout,
	addUserEmail,
	getAccessToken,
}
