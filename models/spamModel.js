module.exports = (sequelize, DataTypes) => {
	const contact = sequelize.define('spam', {}, { timestamps: true })
	return contact
}
