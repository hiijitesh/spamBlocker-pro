const { User, Contact, Spam } = require("../database/dbConfig");
const { Op } = require("sequelize");

const helper = require("../helpers/validator");
// search any contact in database for spam detection
async function searchContact(req, res) {
    const { name, phoneNumber } = req.body;

    if (!name || !phoneNumber) {
        return res.status(400).json({ error: "Empty Search Name or Search Phone." });
    }

    if (name && !helper.validateName(name)) {
        return res.status(400).json({ error: "Invalid searched name." });
    }

    if (phoneNumber && !helper.validatePhoneNumber(phoneNumber)) {
        return res.status(400).json({ error: "Invalid searched phone number." });
    }

    try {
        if (name) {
            const usersData = await User.findAll({
                attributes: ["id", "name", "phone"],
                where: {
                    [Op.or]: [{ name: { [Op.startsWith]: name } }, { name: { [Op.substring]: name } }],
                },
            });

            if (!usersData || usersData.length == 0) {
                return res.status(400).json({ error: "No user found." });
            }

            const search_results = [];

            for (const user of usersData) {
                const temporary_user = { ...user.dataValues };

                temporary_user.spam_count = await Spam.count({
                    where: { spammedUserId: user.dataValues.id },
                });

                search_results.push(temporary_user);
            }

            return res.status(200).json(search_results);
        } else {
            const searched_user = await User.findOne({
                attributes: ["id", "name", "phone", "email"],
                where: {
                    phone: phoneNumber,
                },
            });

            if (!searched_user) {
                return res.status(400).json({ error: "No user found." });
            }

            if (searched_user && searched_user.name !== "NULL") {
                searched_user.dataValues.spam_count = await Spam.count({
                    where: { spammedUserId: searched_user.id },
                });

                const searchById = req.userInfo.id;

                const contact = await Contact.findOne({
                    where: {
                        savedByUserId: searchById,
                        savedContactId: searched_user.id,
                    },
                });
                if (!searched_user.email) {
                    searched_user.email = "User has not added their email address";
                } else if (!contact) {
                    searched_user.email = null;
                }

                return res.status(200).send(searched_user);
            } else {
                const searched_contacts = await Contact.findAll({
                    attributes: ["contactName"],
                    where: { savedContactId: searched_user.id },
                });

                const spam_count = await Spam.count({
                    where: { spammedUserId: searched_user.id },
                });

                const search_results = [{ spammedBy: spam_count }, searched_contacts];
                return res.status(200).send(search_results);
            }
        }
    } catch (error) {
        return res.status(500).json({ error: "Search failed. Try again" });
    }
}

// Adding new contact to db
async function addNewContact(req, res) {
    const { contactName, contactPhoneNumber } = req.body;
    const savedByUserId = req.userInfo.id;

    if (
        !contactName ||
        !contactPhoneNumber ||
        !helper.validatePhoneNumber(contactPhoneNumber) ||
        !helper.validateName(contactName)
    ) {
        return res.status(400).json({
            error: "Invalid Contact Name/Contact Phone Number.",
        });
    }

    try {
        let user = await User.findOne({
            where: { phone: contactPhoneNumber },
        });

        if (!user) {
            user = await User.create({
                name: "NULL",
                phone: contactPhoneNumber,
            });
        }

        const savedContactId = user.id;

        const existingSavedContact = await Contact.findOne({
            where: { savedByUserId, savedContactId },
        });

        if (existingSavedContact) {
            res.status(400).json({ error: "Contact is already saved." });
            return;
        }

        await Contact.create({
            name: contactName,
            savedByUserId: savedByUserId,
            savedContactId: savedContactId,
        });

        res.status(201).json({ message: "Contact created successfully." });
    } catch (error) {
        res.status(500).json({ error: "Saving contact failed. Try again." });
        return;
    }
}

async function markContactAsSpam(req, res) {
    const phoneNumber = req.body.phoneNumber;
    const spamMarkedById = req.userInfo.id;
    if (!phoneNumber || !helper.validatePhoneNumber(phoneNumber)) {
        res.status(400).json({ error: "Invalid phone number." });
        return;
    }

    try {
        const existingUser = await User.findOne({
            where: { phone: phoneNumber },
        });

        if (!existingUser) {
            newUser = await User.create({
                name: "NULL",
                phone: phoneNumber,
            });

            const spammedUserId = newUser.id;

            await Spam.create({
                spammedUserId: spammedUserId,
                spamMarkedBy: spamMarkedById,
            });

            return res.status(201).json({ message: "Marked as spam successfully." });
        } else {
            const spammedUserId = existingUser.id;

            const existingSpam = await Spam.findOne({
                where: {
                    spammedUserId: spammedUserId,
                    spamMarkedById: spamMarkedById,
                },
            });

            if (existingSpam) {
                return res.status(400).json({
                    error: "You have already marked this user as spam.",
                });
            }

            await Spam.create({
                spammedUserId: spammedUserId,
                spamMarkedById: spamMarkedById,
            });

            return res.status(201).json({ message: "Marked as spam successfully." });
        }
    } catch (error) {
        res.status(500).json({ error: "Marking spam failed. Try again." });
        return;
    }
}

module.exports = {
    searchContact,
    addNewContact,
    markContactAsSpam,
};
