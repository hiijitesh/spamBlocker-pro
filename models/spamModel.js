module.exports = (sequelize, DataTypes) => {
	const contact = sequelize.define('spam', {}, { timestamps: false });
	return contact;
};
