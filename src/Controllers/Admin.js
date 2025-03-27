const filterAndPaginate = require('../Middlewares/Pagination');
const Admin = require('../Models/Admin');
const superAdmin = require('../Models/superAdmin');
const { hashPassword, isPasswordMatch, generateToken, generateOtp } = require('../utils/Helpers');
const nodemailer = require('nodemailer');
const { SendMail } = require('../utils/SGMail');
const CustomerRequest = require('../Models/CustomerRequest');
const { Op } = require('sequelize');
const Driver = require('../Models/Driver');
const Vehicle = require('../Models/Vehicle');

const AdminRegister = async (req, res) => {
    const { name, phone, email, password, Location, latitude, longitude } = req.body;
    const { id } = req.decode;
    const { file } = req;
    try {
        const data = await Admin.findOne({ where: { email: email } });
        if (data) return res.status(400).json({ success: false, message: "Email already exist" });
        const existphone = await Admin.findOne({ where: { phone: phone } });
        if (existphone) return res.status(400).json({ success: false, message: "phone number already exist" });
        const hash = await hashPassword(password);
        const admin = await Admin.create({ name, phone, email, password: hash, Location, latitude, longitude, createdBy: id, profile_pic: file?.key });
        return res.status(201).json({ success: true, message: "Admin created successfully", admin })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error", error })
    }
    /*
       #swagger.autoBody = false
       #swagger.consumes = ['multipart/form-data']
       #swagger.parameters['name'] = { in: 'formData', type: 'string', required: false}
       #swagger.parameters['phone'] = { in: 'formData', type: 'string', required: false}
       #swagger.parameters['email'] = { in: 'formData', type: 'string', required: true}
       #swagger.parameters['password'] = { in: 'formData', type: 'string', required: false}
       #swagger.parameters['Location'] = { in: 'formData', type: 'string', required: false}
       #swagger.parameters['latitude'] = { in: 'formData', type: 'string', required: false}
       #swagger.parameters['longitude'] = { in: 'formData', type: 'string', required: false}
       #swagger.parameters['Profile_pic'] = { in: 'formData', type: 'file', required: false,description: 'Upload Single files.'}
   */
}

//login Admin
const AdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingAdmin = await Admin.findOne({ where: { email } })
        if (!existingAdmin) return res.status(404).json({ success: false, message: "Email doesnot exist" });
        const MatchPassword = await isPasswordMatch(password, existingAdmin.password)
        if (!MatchPassword) return res.status(404).json({ success: false, message: "Password doenot match" });
        const token = generateToken({ id: existingAdmin.id, role: "Admin" });
        return res.status(200).json({ success: true, message: "login Successfully", token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error" })
    }
}

//reset password 
const AdminResetpassword = async (req, res) => {
    const { id } = req.decode;
    try {
        const { password, newPassword, confirmPassword } = req.body
        const existingAdmin = await Admin.findByPk(id);
        if (!existingAdmin) return res.status(401).json({ success: false, message: "Admin doesnot exist" });
        const MatchPassword = await isPasswordMatch(password, existingAdmin.password);
        if (!MatchPassword) return res.status(401).json({ success: false, message: "Password does not match" });
        if (newPassword !== confirmPassword) {
            return res.status(401).json({ success: false, message: "Passwords doesnot match" })
        }
        const hashedpassword = await hashPassword(newPassword);
        await existingAdmin.update({ password: hashedpassword })
        return res.status(200).json({ success: true, message: "Password Reset successfully" })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Server Error", error })
    }
}

const AdminForgotpassword = async (req, res) => {
    try {
        const { email } = req.body;
        const existingAdmin = await Admin.findOne({ where: { email: email } })
        if (!existingAdmin) return res.status(401).json({ success: false, message: "Emaid does not exist" })
        const OTP = generateOtp();
        await existingAdmin.update({ OTP: OTP, OTPExpires: new Date(Date.now() + 10 * 60000) }, { where: { email: email } });
        await SendMail({
            email: email,
            subject: "Reset Password",
            text: `Your OTP is ${OTP} and it will expire in 10 minutes. Pleas
          enter this OTP in the reset password form to reset your password.`,
        });
        return res.status(201).json({ success: true, message: "OTP Sent successful" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ Success: false, message: "Server Error", error })
    }
}

//API 2 recreatePassword
const AdminRecreatePassword = async (req, res) => {
    try {
        const { email, OTP, newPassword, confirmPassword } = req.body;
        const existingAdmin = await Admin.findOne({ where: { email } });
        if (!existingAdmin) {
            return res.status(401).json({ success: false, message: "Email doesnot exist" });
        }
        if (existingAdmin.OTP !== OTP) {
            return res.status(401).json({ success: false, message: "Invalid OTP" })
        }
        if (new Date() > new Date(existingAdmin.OTPExpires)) return res.status(401).json({ success: false, message: "OTP has expired" })

        if (newPassword !== confirmPassword) {
            return res.status(401).json({ success: false, message: "Passwords didnot match" });
        }
        const hashedpassword = await hashPassword(newPassword);

        await Admin.update({ password: hashedpassword, OTP: null, OTPExpires: null }, { where: { email: email } });
        return res.status(200).json({ success: true, message: "Password Reset Successful" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: true, message: "Server Error" })
    }
};

//get All admins
const GetAllAdmins = async (req, res) => {
    const { id } = req.decode;
    try {
        const Admins = await filterAndPaginate(Admin, { ...req.query, createdBy: id });
        return res.status(201).json({ success: true, message: "Admins fetched Successfully", ...Admins });
    } catch (error) {
        console.log(error)
        return res.status(501).json({ success: false, message: "Server Error" })
    }
    /*
        #swagger.parameters['search'] = { in: 'query', type: 'string', description: 'Search across fields' }
        #swagger.parameters['page'] = { in: 'query', type: 'integer', default: 1 }
        #swagger.parameters['limit'] = { in: 'query', type: 'integer', default: 10 }
    */
}

//get Admin by Id
const GetAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await Admin.findOne({
            where: {
                id: id
            },
            include: {
                model: superAdmin,
                as: 'superAdmin',
            },
        });
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" })
        }
        return res.status(200).json({ success: true, message: "Admin found", data: admin })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Server error" })
    }
}

const GetAdminByid = async (req, res) => {
    try {
        const { id } = req.decode;
        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" })
        }
        return res.status(200).json({ success: true, message: "Admin found", data: admin })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Server error" })
    }
}

//update Admin
const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, email, Location, latitude, longitude } = req.body;
        const existingadmin = await Admin.findByPk(id);
        if (!existingadmin) return res.status(401).json({ success: false, message: "admin not found" })
        const [updatedRowsCount] = await Admin.update({ name, phone, email, Location, latitude, longitude }, { where: { id } });
        if (updatedRowsCount === 0) {
            return res.status(401).json({ success: false, message: "Admin not Updated" })
        }
        const updatedAdmin = await Admin.findByPk(id);
        return res.status(201).json({ success: true, message: "Admin updated Successfully", data: updatedAdmin })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Server Error" })
    }
}
const updateAdminById = async (req, res) => {
    try {
        const { id } = req.decode;
        const { file } = req;
        const { name, phone, email, Location, latitude, longitude } = req.body;
        const whereCondition = {
            id: { [Op.ne]: id }, // Exclude the current admin
        };

        // Add email condition only if email is provided
        if (email) {
            whereCondition.email = email;
        }

        const existingAdmin = await Admin.findOne({ where: whereCondition });
        if (!existingAdmin) return res.status(401).json({ success: false, message: "admin not found" })
        const [updatedRowsCount] = await Admin.update({ name, phone, email, Location, latitude, longitude, profile_pic: file?.key }, { where: { id } });
        if (updatedRowsCount === 0) {
            return res.status(401).json({ success: false, message: "Admin not Updated" })
        }
        const updatedAdmin = await Admin.findByPk(id);
        return res.status(201).json({ success: true, message: "Admin updated Successfully", data: updatedAdmin })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Server Error" })
    }
    /*
       #swagger.autoBody = false
       #swagger.consumes = ['multipart/form-data']
       #swagger.parameters['name'] = { in: 'formData', type: 'string', required: false}
       #swagger.parameters['phone'] = { in: 'formData', type: 'string', required: false}
       #swagger.parameters['email'] = { in: 'formData', type: 'string', required: false}
       #swagger.parameters['Location'] = { in: 'formData', type: 'string', required: false}
       #swagger.parameters['latitude'] = { in: 'formData', type: 'string', required: false}
       #swagger.parameters['longitude'] = { in: 'formData', type: 'string', required: false}
       #swagger.parameters['Profile_pic'] = { in: 'formData', type: 'file', required: false,description: 'Upload Single files.'}
   */
}

const AssignRequest = async (req, res) => {
    try {
        const { id } = req.decode;
        const { Request_id, Driver_id, Vehicle_id } = req.body;
        const existingRequest = await CustomerRequest.findByPk(Request_id);
        if (!existingRequest) return res.status(401).json({ success: false, message: "Request Not Found" });
        const DriverData = await Driver.findByPk(Driver_id);
        if (!DriverData) return res.status(401).json({ success: false, message: "Driver Not Found" });
        if (DriverData.Assign_Status === "Assigned") return res.status(401).json({ success: false, message: "Driver is already assigned" });
        const VehicleData = await Vehicle.findByPk(Vehicle_id);
        if (!VehicleData) return res.status(401).json({ success: false, message: "Vehicle Not Found" });

        await existingRequest.update({
            status: "Assigned",
            driver_id: Driver_id,
            Vehicle_id: Vehicle_id,
            Admin_id: id
        });

        await DriverData.update({ Assign_Status: "Assigned" });

        return res.status(201).json({ success: true, message: "Request Assigned Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

const CompleteRequest = async (req, res) => {
    try {
        const { id } = req.decode;
        const { Trip_id } = req.body;
        const customerRequest = await CustomerRequest.findOne({ where: { id: Trip_id } });
        if (!customerRequest) {
            return res.status(404).json({ message: "Customer Request not found" });
        }
        await customerRequest.update({ status: "Completed" });
        await Material.increment(
            { Total_Weight: customerRequest.Material_Weight },
            { where: { id: customerRequest.material_Id } }
        );
        await Driver.update(
            { Assign_Status: "Unassigned" },
            { where: { id: customerRequest.driver_id } }
        );
        await Vehicle.update(
            { Assign_Status: "Available" },
            { where: { id: customerRequest.driver_id } }
        );
        return res.status(200).json({ success: true, message: "Request Completed Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(error);
    }
}



// Export all functions
module.exports = {
    AdminRegister,
    AdminLogin,
    AdminResetpassword,
    AdminForgotpassword,
    AdminRecreatePassword,
    GetAllAdmins,
    GetAdmin,
    updateAdmin,
    AssignRequest,
    GetAdminByid,
    updateAdminById,
    CompleteRequest
};