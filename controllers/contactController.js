const { db } = require('../database/db_config')
const { Op } = require('sequelize')

const helper = require('../helpers/helper')

const User = db.user
const Contact = db.contact
const Spam = db.spam

async function searchContact(req, res) {
	const searchedName = req.body.searchedName
	const searchedPhoneNumber = req.body.searchedPhoneNumber

	if (!searchedName && !searchedPhoneNumber) {
		res.status(400).json({ error: 'Empty Search Name/Search Phone.' })
		return
	}

	if (searchedName && !helper.validateName(searchedName)) {
		res.status(400).json({ error: 'Invalid searched name.' })
		return
	}

	if (
		searchedPhoneNumber &&
		!helper.validatePhoneNumber(searchedPhoneNumber)
	) {
		res.status(400).json({ error: 'Invalid searched phone number.' })
		return
	}

	try {
		if (searchedName) {
			const searched_users = await User.findAll({
				attributes: ['id', 'name', 'phone'],
				where: {
					[Op.or]: [
						{ name: { [Op.startsWith]: searchedName } },
						{ name: { [Op.substring]: searchedName } },
					],
				},
			})

			if (!searched_users || searched_users.length == 0) {
				res.status(400).json({ error: 'No user found.' })
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
				attributes: ['id', 'name', 'phone', 'email'],
				where: {
					phone: searchedPhoneNumber,
				},
			})

			if (!searched_user) {
				res.status(400).json({ error: 'No user found.' })
				return
			}

			if (searched_user && searched_user.name !== 'NULL') {
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
						'User has not added their email address'
				} else if (!contact) {
					searched_user.email = null
				}

				res.status(200).send(searched_user)
				return
			} else {
				const searched_contacts = await Contact.findAll({
					attributes: ['contactName'],
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
		res.status(500).json({ error: 'Search failed. Try again' })
		return
	}
}

async function addNewContact(req, res) {
	let contactPhoneNumber = req.body.contactPhoneNumber
	let contactName = req.body.contactName
	let savedByUserId = req.userInfo.id

	if (
		!contactName ||
		!contactPhoneNumber ||
		!helper.validatePhoneNumber(contactPhoneNumber) ||
		!helper.validateName(contactName)
	) {
		res.status(400).json({
			error: 'Invalid Contact Name/Contact Phone Number.',
		})
		return
	}

	try {
		let user = await User.findOne({
			where: { phone: contactPhoneNumber },
		})

		if (!user) {
			user = await User.create({
				name: 'NULL',
				phone: contactPhoneNumber,
			})
		}

		let savedContactId = user.id

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
		return
	}
}

async function markContactAsSapm(req, res) {
	const phoneNumber = req.body.phoneNumber
	const spamMarkedById = req.userInfo.id

	if (!phoneNumber || !helper.validatePhoneNumber(phoneNumber)) {
		res.status(400).json({ error: 'Invalid phone number.' })
		return
	}

	try {
		const existingUser = await User.findOne({
			where: { phone: phoneNumber },
		})

		if (!existingUser) {
			newUser = await User.create({
				name: 'NULL',
				phone: phoneNumber,
			})

			const spammedUserId = newUser.id

			await Spam.create({
				spammedUserId: spammedUserId,
				spamMarkedBy: spamMarkedById,
			})

			res.status(201).json({ message: 'Marked as spam successfully.' })
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
					error: 'You have already marked this user as spam.',
				})
			}

			await Spam.create({
				spammedUserId: spammedUserId,
				spamMarkedById: spamMarkedById,
			})

			res.status(201).json({ message: 'Marked as spam successfully.' })
		}
	} catch (error) {
		res.status(500).json({ error: 'Marking spam failed. Try again.' })
		return
	}
}

module.exports = {
	searchContact,
	addNewContact,
	markContactAsSapm,
}
