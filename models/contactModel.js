module.exports = (sequelize, DataTypes) => {
    const contact = sequelize.define(
        "contact",
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        { timestamps: true }
    );

    return contact;
};
