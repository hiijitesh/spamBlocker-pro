module.exports = (sequelize, DataTypes) => {
	const refreshtoken = sequelize.define(
		"refreshtoken",
		{
			token: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{ timestamps: false }
	)
	return refreshtoken
}
