const Vehicle = require('../Models/Vehicle');
const { Op } = require("sequelize");

const createVehicle = async (req, res) => {
    try {
        const { id } = req.decode;
        const { Registration_no, chassis_number } = req.body;

        const existingVehicle = await Vehicle.findOne({
            where: {
                [Op.or]: [
                    { Registration_no: Registration_no },
                    { chassis_number: chassis_number }
                ]
            }
        }); if (existingVehicle) {
            return res.status(401).json({ success: false, message: "Vehicle already exists" });
        }
        const vehicle = await Vehicle.create({ Registration_no, chassis_number, createdBy: id });
        res.status(201).json({ success: true, message: "Vehicle created successfully", data: vehicle })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Server error" })
    }
}

//get vehicles
const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.findAll();
        return res.status(201).json({ success: true, message: "vehicles fetched Successfully", data: vehicles })
    } catch (error) {
        console.log(error)
        return res.stats(500).json({ success: false, message: "server error" })
    }
}

//get vehicleById
const vehicleById = async (req, res) => {
    try {
        const { id } = req.params
        const vehicle = await Vehicle.findByPk(id)
        if (!vehicle) {
            return res.status(401).json({ success: true, message: "vehicles not fetched " });
        } else {
            return res.status(201).json({ success: true, message: "vehicles fetched Successfully", data: vehicle })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ succes: false, message: "Server error " })
    }
}

//update Vehicle
const updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const { Registration_no, chassis_number } = req.body;
        const existingvehicle = await Vehicle.findByPk(id);
        if (!existingvehicle) return res.status(401).json({ success: false, message: "vehicle doesnot exist" })
        const [updatedRowsCount] = await Vehicle.update({ Registration_no, chassis_number }, { where: { id } });
        if (updatedRowsCount === 0) {
            return res.status(401).json({ success: false, message: "vehicle not Updated" });
        }
        return res.status(201).json({ success: true, message: "vehicle Updated successfully" });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "server error" });
    }
}
module.exports = {
    createVehicle,
    getVehicles,
    vehicleById,
    updateVehicle
}