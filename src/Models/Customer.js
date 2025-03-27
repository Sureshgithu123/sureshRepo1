const { DataTypes } = require('sequelize');
const { getSequelize } = require('../config/database');
const sequelize = getSequelize();

const Customer = sequelize.define('customers',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Phone: {
            type: DataTypes.STRING(15),
            allowNull: false,
            unique: true,
            validate: {
                isNumeric: true
            }
        },
        Status: {
            type: DataTypes.ENUM('Active', 'Inactive'),
            defaultValue: 'Active'
        },
    },
    {
        timestamps: true
    }
);

module.exports = Customer;