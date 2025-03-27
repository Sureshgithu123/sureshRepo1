const { DataTypes } = require('sequelize');
const { getSequelize } = require('../config/database');
const Customer = require('../Models/Customer');
const Driver = require('../Models//Driver');
const Vehicle = require('../Models/Vehicle');
const sequelize = getSequelize();

const CustomerRequest = sequelize.define('CustomerRequest',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true
        },
        Request_id: {
            type: DataTypes.INTEGER,
            unique: true
        },
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "customers",
                key: 'id'
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('Requested', 'Assigned', 'Accepted', 'Picked', 'Arrived', 'completed', 'cancelled'),
            defaultValue: 'Requested'
        },
        material_Type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        material_Id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            reference: {
                model: "materials",
                key: "id"
            }
        },
        Vehicle_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            reference: {
                model: 'vehicles',
                key: "id"
            }
        },
        CheckIn_latitude: {
            type: DataTypes.STRING,
            allowNull: true
        },
        CheckIn_longitude: {
            type: DataTypes.STRING,
            allowNull: true
        },
        CheckIn_Location: {
            type: DataTypes.STRING,
            allowNull: true
        },
        CheckOut_latitude: {
            type: DataTypes.STRING,
            allowNull: true
        },
        CheckOut_longitude: {
            type: DataTypes.STRING,
            allowNull: true
        },
        CheckOut_Location: {
            type: DataTypes.STRING,
            allowNull: true
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
        driver_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'drivers',
                key: 'id'
            }
        },
        Admin_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'admins',
                key: 'id'
            }
        },
        Vehicle_Empty_Weight: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Vehicle_Load_Weight: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Material_Weight: {
            type: DataTypes.STRING,
            allowNull: true
        },
        starting_OdoMeter_Reading: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Ending_OdoMeter_Reading: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Request_Date: {
            type: DataTypes.STRING,
            allowNull: true
        },
        CheckIn_time: {
            type: DataTypes.STRING,
            allowNull: true
        },
        CheckOut_time: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Remarks: {
            type: DataTypes.STRING,
            allowNull: true
        },
    },
    {
        timestamps: true
    }
);
CustomerRequest.belongsTo(Customer, {
    foreignKey: 'customer_id',
    as: 'customers'
});
CustomerRequest.belongsTo(Driver, {
    foreignKey: 'driver_id',
    as: 'drivers'
});
CustomerRequest.belongsTo(Vehicle, { foreignKey: 'Vehicle_id', as: 'vehicles' });   // Added missing association


module.exports = CustomerRequest;