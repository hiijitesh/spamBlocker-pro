<<<<<<< HEAD
const { db } = require("../database/dbConfig")
const { Op } = require("sequelize")

const helper = require("../helpers/helper")
=======
const { db } = require('../database/db_config')
const { Op } = require('sequelize')

const helper = require('../helpers/helper')
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a

const User = db.user
const Contact = db.contact
const Spam = db.spam

//search any contact in database for spam detection
async function searchContact(req, res) {
	const searchedName = req.body.searchedName
	const searchedPhoneNumber = req.body.searchedPhoneNumber

	if (!searchedName && !searchedPhoneNumber) {
<<<<<<< HEAD
		res.status(400).json({ error: "Empty Search Name/Search Phone." })
		return
	}

	//if search name is provided but its not valid
	if (searchedName && !helper.validateName(searchedName)) {
		res.status(400).json({ error: "Invalid searched name." })
		return
	}

	//check given phone number is valid or not
=======
		res.status(400).json({ error: 'Empty Search Name/Search Phone.' })
		return
	}

	if (searchedName && !helper.validateName(searchedName)) {
		res.status(400).json({ error: 'Invalid searched name.' })
		return
	}

>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
	if (
		searchedPhoneNumber &&
		!helper.validatePhoneNumber(searchedPhoneNumber)
	) {
<<<<<<< HEAD
		res.status(400).json({ error: "Invalid searched phone number." })
		return
	}

	//at this point searchedName and phone number is valid so that we will look into the database
	try {
		if (searchedName) {
			const searched_users = await User.findAll({
				attributes: ["id", "name", "phone"],
=======
		res.status(400).json({ error: 'Invalid searched phone number.' })
		return
	}

	try {
		if (searchedName) {
			const searched_users = await User.findAll({
				attributes: ['id', 'name', 'phone'],
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
				where: {
					[Op.or]: [
						{ name: { [Op.startsWith]: searchedName } },
						{ name: { [Op.substring]: searchedName } },
					],
				},
			})

			if (!searched_users || searched_users.length == 0) {
<<<<<<< HEAD
				res.status(400).json({ error: "No user found." })
=======
				res.status(400).json({ error: 'No user found.' })
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
				return
			}

			const search_results = []

			for (const user of searched_users) {
				const temporary_user = { ...user.dataValues }

				temporary_user.spam_count = await Spam.count({
					where: { spammedUserId: user.dataValues.id },
				})

				search_results.push(temporary_user)
			}

			res.status(200).json(search_results)
			return
		} else {
			const searched_user = await User.findOne({
<<<<<<< HEAD
				attributes: ["id", "name", "phone", "email"],
=======
				attributes: ['id', 'name', 'phone', 'email'],
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
				where: {
					phone: searchedPhoneNumber,
				},
			})

			if (!searched_user) {
<<<<<<< HEAD
				res.status(400).json({ error: "No user found." })
				return
			}

			if (searched_user && searched_user.name !== "NULL") {
=======
				res.status(400).json({ error: 'No user found.' })
				return
			}

			if (searched_user && searched_user.name !== 'NULL') {
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
				searched_user.dataValues.spam_count = await Spam.count({
					where: { spammedUserId: searched_user.id },
				})

				const searchById = req.userInfo.id

				const contact = await Contact.findOne({
					where: {
						savedByUserId: searchById,
						savedContactId: searched_user.id,
					},
				})
				if (!searched_user.email) {
					searched_user.email =
<<<<<<< HEAD
						"User has not added their email address"
=======
						'User has not added their email address'
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
				} else if (!contact) {
					searched_user.email = null
				}

				res.status(200).send(searched_user)
				return
			} else {
				const searched_contacts = await Contact.findAll({
<<<<<<< HEAD
					attributes: ["contactName"],
=======
					attributes: ['contactName'],
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
					where: { savedContactId: searched_user.id },
				})

				const spam_count = await Spam.count({
					where: { spammedUserId: searched_user.id },
				})

				const search_results = [
					{ spammedBy: spam_count },
					searched_contacts,
				]
				res.status(200).send(search_results)
				return
			}
		}
	} catch (error) {
<<<<<<< HEAD
		res.status(500).json({ error: "Search failed. Try again" })
=======
		res.status(500).json({ error: 'Search failed. Try again' })
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
		return
	}
}

// Adding new contact to db
async function addNewContact(req, res) {
	let contactPhoneNumber = req.body.contactPhoneNumber
	let contactName = req.body.contactName
	let savedByUserId = req.userInfo.id

<<<<<<< HEAD
	//validating user given data
=======
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
	if (
		!contactName ||
		!contactPhoneNumber ||
		!helper.validatePhoneNumber(contactPhoneNumber) ||
		!helper.validateName(contactName)
	) {
		res.status(400).json({
<<<<<<< HEAD
			error: "Invalid Contact Name/Contact Phone Number.",
=======
			error: 'Invalid Contact Name/Contact Phone Number.',
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
		})
		return
	}

	try {
		let user = await User.findOne({
			where: { phone: contactPhoneNumber },
		})

<<<<<<< HEAD
		//if user is not present in DB then create new
		if (!user) {
			user = await User.create({
				name: "NULL",
=======
		if (!user) {
			user = await User.create({
				name: 'NULL',
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
				phone: contactPhoneNumber,
			})
		}

		let savedContactId = user.id
<<<<<<< HEAD
		const existingSavedContact = await Contact.findOne({
			where: { savedByUserId, savedContactId },
		})

		if (existingSavedContact) {
			res.status(400).json({ error: "Contact is already saved." })
			return
		}

		await Contact.create({
			contactName: contactName,
			savedByUserId: savedByUserId,
			savedContactId: savedContactId,
		})

		res.status(201).json({ message: "Contact created successfully." })
	} catch (error) {
		res.status(500).json({ error: "Saving contact failed. Try again." })
=======

		const existingSavedContact = await Contact.findOne({
			where: { savedByUserId, savedContactId },
		})

		if (existingSavedContact) {
			res.status(400).json({ error: 'Contact is already saved.' })
			return
		}

		await Contact.create({
			contactName: contactName,
			savedByUserId: savedByUserId,
			savedContactId: savedContactId,
		})

		res.status(201).json({ message: 'Contact created successfully.' })
	} catch (error) {
		res.status(500).json({ error: 'Saving contact failed. Try again.' })
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
		return
	}
}

async function markContactAsSapm(req, res) {
	const phoneNumber = req.body.phoneNumber
	const spamMarkedById = req.userInfo.id

	if (!phoneNumber || !helper.validatePhoneNumber(phoneNumber)) {
<<<<<<< HEAD
		res.status(400).json({ error: "Invalid phone number." })
=======
		res.status(400).json({ error: 'Invalid phone number.' })
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
		return
	}

	try {
		const existingUser = await User.findOne({
			where: { phone: phoneNumber },
		})

		if (!existingUser) {
			newUser = await User.create({
<<<<<<< HEAD
				name: "NULL",
=======
				name: 'NULL',
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
				phone: phoneNumber,
			})

			const spammedUserId = newUser.id

			await Spam.create({
				spammedUserId: spammedUserId,
				spamMarkedBy: spamMarkedById,
			})

<<<<<<< HEAD
			res.status(201).json({ message: "Marked as spam successfully." })
=======
			res.status(201).json({ message: 'Marked as spam successfully.' })
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
		} else {
			const spammedUserId = existingUser.id

			const existingSpam = await Spam.findOne({
				where: {
					spammedUserId: spammedUserId,
					spamMarkedById: spamMarkedById,
				},
			})

			if (existingSpam) {
				res.status(400).json({
<<<<<<< HEAD
					error: "You have already marked this user as spam.",
=======
					error: 'You have already marked this user as spam.',
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
				})
			}

			await Spam.create({
				spammedUserId: spammedUserId,
				spamMarkedById: spamMarkedById,
			})

<<<<<<< HEAD
			res.status(201).json({ message: "Marked as spam successfully." })
		}
	} catch (error) {
		res.status(500).json({ error: "Marking spam failed. Try again." })
=======
			res.status(201).json({ message: 'Marked as spam successfully.' })
		}
	} catch (error) {
		res.status(500).json({ error: 'Marking spam failed. Try again.' })
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
		return
	}
}

module.exports = {
	searchContact,
	addNewContact,
	markContactAsSapm,
}
