const { Op, where } = require('sequelize');
const filterAndPaginate = require('../Middlewares/Pagination');
const CustomerRequest = require('../Models/CustomerRequest');
const Driver = require('../Models/Driver');
const { isPasswordMatch, generateToken, hashPassword } = require('../utils/Helpers');
const Material = require('../Models/Material');
const Vehicle = require('../Models/Vehicle');


const register = async (req, res) => {
    const { name, Phone, Email, Password, licenseNumber, address } = req.body;
    // const { file } = req;
    const { id } = req.decode;
    try {
        const existingDriver = await Driver.findOne({
            where: {
                [Op.or]: [
                    { Email },
                    { licenseNumber },
                    { Phone }
                ]
            }
        });

        if (existingDriver) {
            if (existingDriver.Email === Email) {
                return res.status(400).json({ success: false, message: "Email already exists" });
            }
            if (existingDriver.licenseNumber === licenseNumber) {
                return res.status(400).json({ success: false, message: "License Number already exists" });
            }
            if (existingDriver.Phone === Phone) {
                return res.status(400).json({ success: false, message: "Phone Number already exists" });
            }
        }

        // Hash password before saving
        const hashedPassword = await hashPassword(Password);

        // Create new driver
        const newDriver = await Driver.create({
            name,
            Phone,
            Email,
            Password: hashedPassword,
            // ...(file?.key && { profile_pic: file.key }),
            licenseNumber,
            address,
            createdBy: id
        });

        return res.status(201).json({ success: true, message: "Driver registered successfully", data: newDriver });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const Login = async (req, res) => {
    try {
        const { mobile_no, Password } = req.body;
        const driverdetails = await Driver.findOne({
            where: {
                Phone: mobile_no
            }
        });
        if (!driverdetails) {
            return res.status(404).json({ success: false, message: "Driver not found" });
        }
        const isMatch = await isPasswordMatch(Password, driverdetails.Password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid Password" });
        }
        const token = generateToken({ id: driverdetails.id, role: "Driver" });
        return res.status(200).json({ success: true, message: "Login successful", token });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

const updateDriver = async (req, res) => {
    try {
        const { id } = req.params;
        // const { file } = req;
        const { name, Phone, Email, licenseNumber, address } = req.body;

        // Check if the driver exists
        const driver = await Driver.findByPk(id);
        if (!driver) {
            return res.status(404).json({ success: false, message: "Driver not found" });
        }
        // Check if Email or Phone exists in another record
        const existingDriver = await Driver.findOne({
            where: {
                id: { [Op.ne]: id }, // Exclude the current driver
                [Op.or]: [
                    { Email },
                    { Phone }
                ]
            }
        });

        if (existingDriver) {
            return res.status(400).json({
                success: false,
                message: "Email or Phone number is already in use by another driver"
            });
        }

        // Update driver details
        await driver.update({
            name,
            Phone,
            Email,
            // profile_pic: file?.key || profile_pic,
            licenseNumber,
            address
        });

        res.status(200).json({ success: true, message: "Driver updated successfully", data: driver });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getDriverById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find driver by ID
        const driver = await Driver.findByPk(id);

        if (!driver) {
            return res.status(404).json({ success: false, message: "Driver not found" });
        }

        res.status(200).json({ success: true, data: driver });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
const getDriverBytoken = async (req, res) => {
    try {
        const { id } = req.decode;
        const driver = await Driver.findByPk(id);
        if (!driver) {
            return res.status(404).json({ success: false, message: "Driver not found" });
        }
        return res.status(200).json({ success: true, data: driver });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

    const getAllDrivers = async (req, res) => {
        const { id } = req.decode;
        try {
            // Fetch all drivers
            const drivers = await filterAndPaginate(Driver, { ...req.query, createdBy: id });

            return res.status(200).json({ success: true, ...drivers });

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
        /*
        #swagger.parameters['search'] = { in: 'query', type: 'string', description: 'Search across fields' }
        #swagger.parameters['page'] = { in: 'query', type: 'integer', default: 1 }
        #swagger.parameters['limit'] = { in: 'query', type: 'integer', default: 10 }
    */
};

const CheckinTrip = async (req, res) => {
    try {
        const { id } = req.decode;
        const { starting_OdoMeter_Reading, CheckIn_time, Trip_id, CheckIn_latitude, CheckIn_longitude, CheckIn_Location } = req.body;
        const driverdetails = await Driver.findOne({ where: { id: id } });
        if (!driverdetails) {
            return res.status(404).json({ message: "Driver not found" });
        }
        const customerRequest = await CustomerRequest.findOne({ where: { id: Trip_id } });
        if (!customerRequest) {
            return res.status(404).json({ message: "Customer Request not found" });
        }
        await customerRequest.update({
            starting_OdoMeter_Reading,
            status: 'Accepted',
            CheckIn_time,
            CheckIn_latitude,
            CheckIn_longitude,
            CheckIn_Location
        });
        return res.status(200).json({ message: "Trip accepted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error", error });
    }
}

const RejectTrip = async (req, res) => {
    try {
        const { id } = req.decode;
        const { Reason, Trip_id } = req.body;
        const driverdetails = await Driver.findOne({ where: { id: id } });
        if (!driverdetails) {
            return res.status(404).json({ success: false, message: "Driver not found" });
        }
        const customerRequest = await CustomerRequest.findOne({ where: { id: Trip_id } });
        if (!customerRequest) {
            return res.status(404).json({ success: false, message: "Customer Request not found" });
        }
        await customerRequest.update({
            Remarks: Reason,
            status: 'cancelled',
        });
        return res.status(200).json({ success: true, message: "Trip Rejected successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error", error });
    }
}

const CheckoutTrip = async (req, res) => {
    try {
        const { id } = req.decode;
        const { Ending_OdoMeter_Reading, CheckOut_time, Trip_id, CheckOut_latitude, CheckOut_longitude, CheckOut_Location } = req.body;
        const driverdetails = await Driver.findOne({ where: { id: id } });
        if (!driverdetails) {
            return res.status(404).json({ message: "Driver not found" });
        }
        const customerRequest = await CustomerRequest.findOne({ where: { id: Trip_id } });
        if (!customerRequest) {
            return res.status(404).json({ message: "Customer Request not found" });
        }
        await customerRequest.update({
            Ending_OdoMeter_Reading,
            status: 'Arrived',
            CheckOut_time,
            CheckOut_latitude,
            CheckOut_longitude,
            CheckOut_Location
        });
        // await Material.increment(
        //     { Total_Weight: customerRequest.Material_Weight },
        //     { where: { id: customerRequest.material_Id } }
        // );
        // await Driver.update(
        //     { Assign_Status: "Unassigned" },
        //     { where: { id: customerRequest.driver_id } }
        // );
        // await Vehicle.update(
        //     { Assign_Status: "Available" },
        //     { where: { id: customerRequest.driver_id } }
        // );
        return res.status(200).json({ message: "Trip accepted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error", error });
    }
}

const ChangeDriverStatus = async (req, res) => {
    try {
        const { id } = req.decode;
        const { status } = req.body;
        const driverdetails = await Driver.findByPk(id);
        if (!driverdetails) {
            return res.status(404).json({ message: "Driver not found" });
        }
        await Driver.update(
            { status: status },
            { where: { id } }
        );
        return res.status(200).json({ message: "Status Changed Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error", error });
    }
    /*
    #swagger.autoBody = false
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['status'] = {
        in: 'body',
        type: 'string',
        required: true,
        description: 'Driver status (Active or Inactive)',
        enum: ['Active', 'Inactive']
    }
*/
}

const updatePickupData = async (req, res) => {
    try {
        const { serialNo, Vehicle_Empty_Weight, Vehicle_Load_Weight, Material_Weight, CustomerRequest_id } = req.body;
        const pickupData = await CustomerRequest.findByPk(CustomerRequest_id);
        if (!pickupData) {
            return res.status(404).json({ status: false, message: "Customer Request not found" });
        }
        await pickupData.update({
            serialNo,
            Vehicle_Empty_Weight,
            Vehicle_Load_Weight,
            Material_Weight
        });
        return res.status(200).json({ status: true, message: "Pickup data updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

const getCustomerRequests = async (req, res) => {
    try {
        const { id } = req.decode;
        const { status } = req.query;

        if (!id) {
            return res.status(400).json({ success: false, message: "Driver id is required" });
        }

        let whereCondition = {};
        if (status === "Received") {
            whereCondition = { status: { [Op.ne]: "completed" } }; // Not equal to "completed"
        }
        if (status === "Delivered") {
            whereCondition = { status: "completed" };
        }

        const customerRequests = await CustomerRequest.findAll({ where: whereCondition });

        return res.status(200).json({ success: true, data: customerRequests });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error", error });
    }
};


module.exports = {
    register,
    updateDriver,
    getDriverById,
    getAllDrivers,
    CheckinTrip,
    RejectTrip,
    CheckoutTrip,
    ChangeDriverStatus,
    Login,
    updatePickupData,
    getDriverBytoken,
    getCustomerRequests
}