const { DataTypes } = require('sequelize');
const { getSequelize } = require('../config/database');
const sequelize = getSequelize();
const SuperAdmin = require('./superAdmin');

const Admin = sequelize.define("admins",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isNumeric: true,
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
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
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM,
            values: ['active', 'inactive'],
            defaultValue: "active"
        },
        Location: {
            type: DataTypes.STRING,
            allowNull: true
        },
        latitude: {
            type: DataTypes.STRING,
            allowNull: true
        },
        longitude: {
            type: DataTypes.STRING,
            allowNull: true
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'superadmins',
                key: 'id'
            }
        },
        OTP:{
            type: DataTypes.STRING,
            allowNull: true
        },
        OTPExpires:{
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        timestamps: true
    }
);

Admin.belongsTo(SuperAdmin, {
    foreignKey: 'createdBy',
    as: 'superAdmin'
});

module.exports = Admin;