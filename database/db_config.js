require('dotenv').config()
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(
	process.env.DATABASE_NAME,
	process.env.DATABASE_USER_NAME,
	process.env.DATABASE_PASSWORD,
	{
		host: 'localhost',
		dialect: 'mysql',
	}
)

const db = {
	sequelize: sequelize,
	Sequelize: Sequelize,
}

db.contact = require('../models/contactModel')(sequelize, DataTypes)
db.refreshtoken = require('../models/refreshtokenModel')(sequelize, DataTypes)
db.spam = require('../models/spamModel')(sequelize, DataTypes)
db.user = require('../models/userModel')(sequelize, DataTypes)

db.spam.belongsTo(db.user, {
	as: 'spamMarkedBy',
	foreignKey: {
		allowNull: false,
	},
})

db.spam.belongsTo(db.user, {
	as: 'spammedUser',
	foreignKey: {
		allowNull: false,
	},
})

db.user.hasMany(db.spam, {
	as: 'spamMarkedBy',
	foreignKey: 'spamMarkedById',
})

db.user.hasMany(db.spam, {
	as: 'spammedUser',
	foreignKey: 'spammedUserId',
})

db.contact.belongsTo(db.user, {
	as: 'savedContact',
	foreignKey: {
		allowNull: false,
	},
})

db.contact.belongsTo(db.user, {
	as: 'savedByUser',
	foreignKey: {
		allowNull: false,
	},
})

async function dbConnection() {
	try {
		await sequelize.authenticate()
		console.log('Database connected.')
		await db.sequelize.sync({ force: false })
		console.log('Database synced.')
	} catch (error) {
		throw new Error(error)
	}
}

module.exports = {
	db,
	dbConnection,
}
