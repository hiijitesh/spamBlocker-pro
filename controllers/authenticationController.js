require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const helper = require("../helpers/helper");

const { db } = require("../database/db_config");
const User = db.user;
const JWTRefreshToken = db.refreshtoken;

// This function is used for Generating or Signing JWT token.
function generateJWTToken(user, token_type) {
  let jwt_token;

  if (token_type === "access") {
    jwt_token = jwt.sign(
      { phone: user.phone, id: user.id },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "30m",
      }
    );
  } else {
    jwt_token = jwt.sign({ phone: user.phone }, process.env.REFRESH_TOKEN);
  }
  return jwt_token;
}

// This endpoint is used for User signup.
async function userSignup(req, res) {
  let phone = req.body.phone;
  let password = req.body.password;
  let name = req.body.name;
  let email = req.body.email;

  if (!name || !password || !phone) {
    res.status(400).json({ error: "Empty Name/Phone/Password." });
    return;
  }

  if (
    !helper.validateName(name) ||
    !helper.validatePhoneNumber(phone) ||
    !helper.validatePassword(password)
  ) {
    res.status(400).json({ error: "Invalid Name/Phone/Password." });
    return;
  }

  if (email && !helper.validateEmail(email)) {
    res.status(400).json({ error: "Invalid Email." });
    return;
  }

  try {
    const existingUser = await User.findOne({ where: { phone } });

    if (existingUser && existingUser.name != "NULL") {
      res
        .status(400)
        .json({ error: "Found already existing user with this phone." });
      return;
    }

    hashed_password = await bcrypt.hash(password, 10);

    const newUser = {
      name: name,
      phone: phone,
      password: hashed_password,
    };

    if (email) {
      newUser.email = email;
    }

    if (existingUser && existingUser.name == "NULL") {
      await User.update(newUser, { where: { id: existingUser.id } });
    } else {
      await User.create(newUser);
    }

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: "User signup failed." });
    return;
  }
}

// This endpoint is used for userLogin
async function userLogin(req, res) {
  let phone = req.body.phone;
  let password = req.body.password;

  if (!phone || !password) {
    res
      .status(400)
      .json({ error: "Phone and Password is required for Login." });
    return;
  }

  try {
    const user = await User.findOne({ where: { phone } });

    if (!user) {
      res.status(400).json({ error: "No user found." });
      return;
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      res.status(400).json({ error: "Wrong password." });
      return;
    }

    const access_token = generateJWTToken(user, "access");
    const refresh_token = generateJWTToken(user, "refresh");
    await JWTRefreshToken.create({ token: refresh_token });

    res
      .status(200)
      .json({ access_token, refresh_token, message: "Login successfull" });
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
    const currentRefreshToken = await JWTRefreshToken.findOne({
      where: { token: refresh_token },
    });

    if (!currentRefreshToken) {
      res.status(400).json({ error: "Invalid refresh token." });
      return;
    }

    const new_access_token = generateJWTToken(currentRefreshToken, "access");

    res.status(200).json({
      new_access_token,
      refresh_token,
      message: "New access token generation success.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Access token generation failed. Try again!" });
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
    const currentRefreshToken = await JWTRefreshToken.findOne({
      where: { token: refresh_token },
    });

    if (!currentRefreshToken) {
      res.status(400).json({ error: "Invalid refresh token." });
      return;
    }

    await currentRefreshToken.destroy();

    res.status(200).json({ message: "Logout successfull" });
  } catch (error) {
    res.status(500).json({ error: "Logout failed. Try again" });
    return;
  }
}

async function addUserEmail(req, res) {
  const email = req.body.email;

  if (!email || !helper.validateEmail(email)) {
    res.status(400).json({ error: "Invalid email address." });
    return;
  }

  try {
    const existingUser = await User.findOne({ where: { id: req.userInfo.id } });

    if (!existingUser) {
      res.status(400).json({ error: "No user found." });
      return;
    }

    await User.update({ email }, { where: { id: existingUser.id } });

    res.status(201).json({ message: "Email added succesfully." });
  } catch (error) {
    res.status(500).json({ error: "Adding the email failed. Try again" });
    return;
  }
}

module.exports = {
  userSignup,
  userLogin,
  userLogout,
  addUserEmail,
  getAccessToken,
};
