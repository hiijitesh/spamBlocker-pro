const { User, Spam } = require("../database/dbConfig");

const helper = require("../helpers/validator");

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
    markContactAsSpam,
};
