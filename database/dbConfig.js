/* eslint-disable no-console */
require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

// Database configuration
const dbConfig = {
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER_NAME,
  password: process.env.DATABASE_PASSWORD,
  host: "localhost",
  port: 5432,
  dialect: "postgres",
};

// Create a Sequelize instance
const sequelize = new Sequelize(dbConfig);

// Define models and associations
const User = require("../models/userModel")(sequelize, DataTypes);
const Spam = require("../models/spamModel")(sequelize, DataTypes);
const Contact = require("../models/contactModel")(sequelize, DataTypes);
const RefreshToken = require("../models/refreshTokenModel")(sequelize, DataTypes);

// Define associations
Spam.belongsTo(User, { as: "spamMarkedBy", foreignKey: { allowNull: false } });
Spam.belongsTo(User, { as: "spammedUser", foreignKey: { allowNull: false } });

User.hasMany(Spam, { as: "spamMarkedBy", foreignKey: "spamMarkedById" });
User.hasMany(Spam, { as: "spammedUser", foreignKey: "spammedUserId" });

Contact.belongsTo(User, { as: "savedContact", foreignKey: { allowNull: false } });
Contact.belongsTo(User, { as: "savedByUser", foreignKey: { allowNull: false } });

// Database connection and synchronization
async function dbConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database connected ✅");

    await sequelize.sync({ force: false });
    console.log("Database synced ✅");
  } catch (error) {
    console.error("Database connection error:", error.message);
    throw error;
  }
}

module.exports = { User, Spam, Contact, RefreshToken, dbConnection };
