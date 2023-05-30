require("dotenv").config()
const { Sequelize, DataTypes } = require("sequelize")

// Create a new instance of `Sequelize` with configuration options for connecting to the database.
const sequelize = new Sequelize(
	process.env.DATABASE_NAME,
	process.env.DATABASE_USER_NAME,
	process.env.DATABASE_PASSWORD,
	{
		host: "localhost",
		dialect: "mysql",
	}
)

const db = {
	sequelize: sequelize,
	Sequelize: Sequelize,
}

// Define the models and store them in the `db` object.
db.contact = require("../models/contactModel")(sequelize, DataTypes)
db.refreshtoken = require("../models/refreshtokenModel")(sequelize, DataTypes)
db.spam = require("../models/spamModel")(sequelize, DataTypes)
db.user = require("../models/userModel")(sequelize, DataTypes)

// Set up the associations between the models using Sequelize's association methods.
// `belongsTo` sets up a one-to-many relationship where the foreign key is on the source model (`spam` or `contact`)
// `hasMany` sets up a many-to-one relationship where the foreign key is on the target model (`user`)
db.spam.belongsTo(db.user, {
	as: "spamMarkedBy",
	foreignKey: {
		allowNull: false,
	},
})

db.spam.belongsTo(db.user, {
	as: "spammedUser",
	foreignKey: {
		allowNull: false,
	},
})

db.user.hasMany(db.spam, {
	as: "spamMarkedBy",
	foreignKey: "spamMarkedById",
})

db.user.hasMany(db.spam, {
	as: "spammedUser",
	foreignKey: "spammedUserId",
})

db.contact.belongsTo(db.user, {
	as: "savedContact",
	foreignKey: {
		allowNull: false,
	},
})

db.contact.belongsTo(db.user, {
	as: "savedByUser",
	foreignKey: {
		allowNull: false,
	},
})

// Define an asynchronous function called `dbConnection` to connect to the database and sync the models.
async function dbConnection() {
	try {
		await sequelize.authenticate()
		console.log("Database connected ✅✅✅ ")

		// Use the `sync()` method to sync the models with the database.
		// The `force` option determines whether to drop and recreate the tables (true) or simply create them if they don't exist (false).
		await db.sequelize.sync({ force: false })
		console.log("Database synced ✅✅✅ ")
	} catch (error) {
		throw new Error(error)
	}
}

module.exports = {
	db,
	dbConnection,
}
