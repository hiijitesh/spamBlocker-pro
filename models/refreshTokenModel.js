module.exports = (sequelize, DataTypes) => {
    const refreshToken = sequelize.define(
        "refreshToken",
        {
            token: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        { timestamps: false }
    );
    return refreshToken;
};
