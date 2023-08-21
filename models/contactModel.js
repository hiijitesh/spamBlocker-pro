module.exports = (sequelize, DataTypes) => {
  const contact = sequelize.define(
    "contact",
    {
      contactName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { timestamps: true },
  );

  return contact;
};
