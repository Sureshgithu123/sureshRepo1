const { DataTypes } = require('sequelize');
const { getSequelize } = require('../config/database');
const sequelize = getSequelize();

const Driver = sequelize.define('drivers',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Phone: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isNumeric: true
            }
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            valitade: {
                isEmail: true
            }
        },
        Password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        profile_pic: {
            type: DataTypes.STRING,
            allowNull: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: "active"
        },
        licenseNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        Assign_Status: {
            type: DataTypes.ENUM('Assigned', 'Unassigned'),
            defaultValue: 'Unassigned'
        },
        // Assigned_Vehicle_id: {
        //     type: DataTypes.INTEGER,
        //     allowNull: true,
        //     references: {
        //         model: 'vehicles',
        //         key: 'id'
        //     }
        // },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
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

module.exports = Driver;