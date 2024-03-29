require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const helper = require("../helpers/validator");

const { User, JWTRefreshToken } = require("../database/dbConfig");

// User signup function
async function userSignup(req, res) {
    const { phone, password, name, email } = req.body;

    if (!name || !password || !phone) {
        res.status(400).json({ error: "Empty Name/Phone/Password." });
        return;
    }

    if (!helper.validateName(name) || !helper.validatePhoneNumber(phone) || !helper.validatePassword(password)) {
        res.status(400).json({ error: "Invalid Name/Phone/Password." });
        return;
    }

    if (email && !helper.validateEmail(email)) {
        res.status(400).json({ error: "Invalid Email." });
        return;
    }

    // check user already have signup
    try {
        const existingUser = await User.findOne({ where: { phone } });

        if (existingUser && existingUser.name != "NULL") {
            res.status(400).json({
                error: "Found already existing user with this phone.",
            });
            return;
        }

        // user is new, hash the password
        hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            name: name,
            phone: phone,
            password: hashedPassword,
        };

        // since email is optional so we can add if email if it does exist
        if (email) {
            newUser.email = email;
        }
        // update username of user else create new user
        if (existingUser && existingUser.name == "NULL") {
            await User.update(newUser, { where: { id: existingUser.id } });
        } else {
            await User.create(newUser);
        }

        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ error: "User signup failed." });
        return;
    }
}

// user Login function
async function userLogin(req, res) {
    const { phone, password } = req.body;

    // check phone or password is missing/empty
    if (!phone || !password) {
        res.status(400).json({
            error: "Phone and Password is required for Login.",
        });
        return;
    }

    // find user in DB using phone number
    try {
        const user = await User.findOne({ where: { phone } });

        if (!user) {
            res.status(400).json({ error: "No user found." });
            return;
        }

        // compare the user entered password and DB password of the user
        const matchPassword = await bcrypt.compare(password, user.password);

        if (!matchPassword) {
            res.status(400).json({ error: "Wrong password." });
            return;
        }

        const access_token = generateJWTToken(user, "access");
        const refresh_token = generateJWTToken(user, "refresh");
        await JWTRefreshToken.create({ token: refresh_token });

        return res.status(200).json({
            message: "Login successful",
            access_token,
            refresh_token,
        });
    } catch (error) {
        res.status(500).json({ error: "Login failed. Try again!" });
        return;
    }
}

// This endpoint is used to get the access token.
async function getAccessToken(req, res) {
    const refresh_token = req.body.refresh_token;

    if (!refresh_token) {
        res.status(400).json({ error: "Refresh token is missing." });
        return;
    }

    try {
        const currentRefreshToken = await RefreshToken.findOne({
            where: { token: refresh_token },
        });

        if (!currentRefreshToken) {
            res.status(400).json({ error: "Invalid refresh token." });
            return;
        }

        const new_access_token = generateJWTToken(currentRefreshToken, "access");

        return res.status(200).json({
            message: "New access token generation success.",
            new_access_token,
            refresh_token,
        });
    } catch (error) {
        res.status(500).json({
            error: "Access token generation failed. Try again!",
        });
        return;
    }
}

// This end point is used for userLogout
async function userLogout(req, res) {
    const refresh_token = req.body.refresh_token;

    if (!refresh_token) {
        res.status(400).json({ error: "Refresh token is missing." });
        return;
    }

    try {
        const currentRefreshToken = await RefreshToken.findOne({
            where: { token: refresh_token },
        });

        if (!currentRefreshToken) {
            res.status(400).json({ error: "Invalid refresh token." });
            return;
        }

        await currentRefreshToken.destroy();

        res.status(200).json({ message: "Logout successful" });
        return;
    } catch (error) {
        res.status(500).json({ error: "Logout failed. Try again" });
        return;
    }
}

// since email was optional so we can add email later on
async function addUserEmail(req, res) {
    const email = req.body.email;

    if (!email || !helper.validateEmail(email)) {
        res.status(400).json({ error: "Invalid email address." });
        return;
    }

    try {
        const existingUser = await User.findOne({
            where: { id: req.userInfo.id },
        });

        if (!existingUser) {
            res.status(400).json({ error: "No user found." });
            return;
        }

        await User.update({ email }, { where: { id: existingUser.id } });

        return res.status(201).json({ message: "Email added successfully." });
    } catch (error) {
        res.status(500).json({ error: "Adding the email failed. Try again" });
        return;
    }
}
// This function is used for generating or signing JWT token.
function generateJWTToken(user, token_type) {
    let token;

    if (token_type === "access") {
        token = jwt.sign({ phone: user.phone, id: user.id }, process.env.ACCESS_TOKEN, {
            expiresIn: "24h",
        });
    } else if (token_type === "refresh") {
        token = jwt.sign({ phone: user.phone }, process.env.REFRESH_TOKEN, {
            expiresIn: "30days",
        });
    }
    return token;
}
module.exports = {
    userSignup,
    userLogin,
    userLogout,
    addUserEmail,
    getAccessToken,
};
