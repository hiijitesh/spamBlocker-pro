module.exports = (sequelize, DataTypes) => {
<<<<<<< HEAD
  const user = sequelize.define(
    "user",
    {
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        defaultValue: "NULL",
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false, 
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true, //email is optional
      },
    },
    { timestamps: false }
  );
  return user;
};
=======
	const user = sequelize.define(
		'user',
		{
			phone: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				defaultValue: 'NULL',
			},
			password: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{ timestamps: false }
	)
	return user
}
>>>>>>> e86e45705a13f14ee8802dabebb5a83d9d5deb3a
