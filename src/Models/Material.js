const { DataTypes } = require('sequelize');
const { getSequelize } = require('../config/database');
const sequelize = getSequelize();

const Material = sequelize.define('materials',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true
        },
        Material_Name: {
            type: DataTypes.STRING(20),
            unique: true
        },
        Total_Weight: {
            type: DataTypes.STRING,
        },
        Status: {
            type: DataTypes.ENUM('Active', 'Inactive'),
            defaultValue: 'Active'
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'admins',
                key: 'id'
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = Material;