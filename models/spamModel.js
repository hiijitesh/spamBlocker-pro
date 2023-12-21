module.exports = (sequelize, DataTypes) => {
    const spam = sequelize.define("spam", {}, { timestamps: true });
    return spam;
};
