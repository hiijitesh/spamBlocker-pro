/* eslint-disable no-console */
require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

// Create a new instance of `Sequelize` with configuration options for connecting to the database.
const sequelizeInstance = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER_NAME,
  process.env.DATABASE_PASSWORD,
  {
    host: "localhost",
    port: "5432",
    dialect: "postgres",
  },
);

const db = {
  sequelize: sequelizeInstance,
  Sequelize: Sequelize,
};

// Define the models instances and store them in the `db` object.
// these are IIFE
// immediately invoked function expression (IIFE) is used to initialize the model by passing two arguments: the sequelize instance (sequelizeInstance created) and the DataTypes object from Sequelize.
db.contact = require("../models/contactModel")(sequelizeInstance, DataTypes);
db.refreshToken = require("../models/refreshTokenModel")(sequelizeInstance, DataTypes);
db.spam = require("../models/spamModel")(sequelizeInstance, DataTypes);
db.user = require("../models/userModel")(sequelizeInstance, DataTypes);

// Set up the associations between the models using Sequelize's association methods.
// `belongsTo` sets up a one-to-many relationship where the foreign key is on the source model (`spam` or `contact`)
db.spam.belongsTo(db.user, {
  as: "spamMarkedBy",
  foreignKey: {
    allowNull: false,
  },
});

db.spam.belongsTo(db.user, {
  as: "spammedUser",
  foreignKey: {
    allowNull: false,
  },
});

// `hasMany` sets up a many-to-one relationship where the foreign key is on the target model (`user`)
db.user.hasMany(db.spam, {
  as: "spamMarkedBy",
  foreignKey: "spamMarkedById",
});

db.user.hasMany(db.spam, {
  as: "spammedUser",
  foreignKey: "spammedUserId",
});

db.contact.belongsTo(db.user, {
  as: "savedContact",
  foreignKey: {
    allowNull: false,
  },
});

db.contact.belongsTo(db.user, {
  as: "savedByUser",
  foreignKey: {
    allowNull: false,
  },
});

// Define an asynchronous function called `dbConnection` to connect to the database and sync the models.
async function dbConnection() {
  try {
    await sequelizeInstance.authenticate();
    console.log("Database connected ✅✅✅ ");

    // Use the `sync()` method to sync the models with the database.
    // The `force` option determines whether to drop and recreate the tables (true) or simply create them if they don't exist (false).
    await db.sequelize.sync({ force: false });
    console.log("Database synced ✅ ");
  } catch (error) {
    throw new Error(error);
  }
}

const User = db.user;
const Contact = db.contact;
const Spam = db.spam;
const JWTRefreshToken = db.refreshToken;

module.exports = {
  db,
  dbConnection,
  User,
  Contact,
  Spam,
  JWTRefreshToken,
};
