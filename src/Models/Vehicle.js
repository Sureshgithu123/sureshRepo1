const { DataTypes } = require('sequelize');
const { getSequelize } = require('../config/database');
const sequelize = getSequelize();

const Vehicle = sequelize.define('vehicles',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true
        },
        Registration_no: {
            type: DataTypes.STRING(20),
            unique: true
        },
        chassis_number: {
            type: DataTypes.STRING,
            unique: true
        },
        Assign_Status: {
            type: DataTypes.ENUM('Available', 'Assigned'),
            defaultValue: 'Available'
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

module.exports = Vehicle;