const { getSequelize } = require('../config/database');
const { DataTypes } = require('sequelize');
const sequelize = getSequelize();

const superAdmin = sequelize.define("superadmins",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        profile_pic: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
    },
    {
        timestamps: true,
    }
);

// superAdmin.hasMany(Admin, {
//     foreignKey: 'createdBy',
//     as: 'admins'
// });

module.exports = superAdmin;
