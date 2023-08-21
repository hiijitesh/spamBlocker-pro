module.exports = (sequelize, DataTypes) => {
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
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { timestamps: true },
  );
  return user;
};
