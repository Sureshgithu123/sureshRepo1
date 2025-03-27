const superAdmin = require("../Models/superAdmin");
const { hashPassword, isPasswordMatch, generateToken, generateOtp } = require("../utils/Helpers");
const nodemailer = require('nodemailer');
const { SendMail } = require('../utils/SGMail');
const { Op } = require('sequelize');

const Register = async (req, res) => {
    const { name, email, password, passcode } = req.body;
    const { file } = req;

    try {
        const data = await superAdmin.findOne({ where: { email } });
        if (data) return res.status(400).json({ success: false, message: "Email already exists" });
        if (passcode !== process.env.PASSCODE) return res.status(400).json({ success: false, message: "Passcode is incorrect" });
        const hash = await hashPassword(password);
        const user = await superAdmin.create({ name, email, password: hash, profile_pic: file?.key });
        return res.status(201).json({ success: true, message: "Super Admin created successfully", user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error", error });
    }
    /*
        #swagger.autoBody = false
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['name'] = { in: 'formData', type: 'string', required: false}
        #swagger.parameters['email'] = { in: 'formData', type: 'string', required: true}
        #swagger.parameters['password'] = { in: 'formData', type: 'string', required: false}
        #swagger.parameters['passcode'] = { in: 'formData', type: 'string', required: false}
        #swagger.parameters['Profile_pic'] = { in: 'formData', type: 'file', required: false,description: 'Upload Single files.'}
    */
}

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await superAdmin.findOne({ where: { email } });
        if (!data) {
            return res.status(400).json({ success: false, message: "Email does not exist" });
        }
        const isMatch = await isPasswordMatch(password, data.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Password is incorrect" });
        }
        const token = await generateToken({ id: data.id, role: "SuperAdmin" });
        return res.status(200).json({ success: true, message: "Logged in successfully", token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error", error });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email, password, newPassword, confirmpassword } = req.body;
        const existingSuperAdmin = await superAdmin.findOne({ where: { email: email } });
        if (!existingSuperAdmin) {
            return res.status(401).json({ success: false, mesage: "Invalid Email" });
        }
        const MatchPassword = await isPasswordMatch(password, existingSuperAdmin.password);
        if (!MatchPassword) {
            return res.status(401).json({ success: true, message: "Password doesnot match" });
        }
        if (newPassword !== confirmpassword) {
            return res.status(401).json({ success: false, message: "Passwords doesn't match" });
        }
        const hashedpassword = await hashPassword(newPassword);
        await existingSuperAdmin.update({ password: hashedpassword })
        return res.status(200).json({ success: true, message: "Password reset Successful" })
    } catch (error) {
        console.log(error);
        return res.status(500).josn({ success: true, message: "Server Error" })
    }
}

const superAdminForgotpassword = async (req, res) => {
    try {
        const { email } = req.body;
        const existingSuperAdmin = await superAdmin.findOne({ where: { email: email } })
        if (!existingSuperAdmin) return res.status(401).json({ success: false, message: "Emaid does not exist" })
        const OTP = generateOtp();
        await existingSuperAdmin.update({ OTP: OTP, OTPExpires: new Date(Date.now() + 10 * 60000) }, { where: { email: email } });
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
const superAdminRecreatePassword = async (req, res) => {
    try {
        const { email, OTP, newPassword, confirmPassword } = req.body;
        const existingSuperAdmin = await superAdmin.findOne({ where: { email } });
        if (!existingSuperAdmin) {
            return res.status(401).json({ success: false, message: "Email doesnot exist" });
        }
        if (existingSuperAdmin.OTP !== OTP) {
            return res.status(401).json({ success: false, message: "Invalid OTP" })
        }
        if (new Date() > new Date(existingSuperAdmin.OTPExpires)) return res.status(401).json({ success: false, message: "OTP has expired" })

        if (newPassword !== confirmPassword) {
            return res.status(401).json({ success: false, message: "Passwords didnot match" });
        }
        const hashedpassword = await hashPassword(newPassword);

        await superAdmin.update({ password: hashedpassword, OTP: null, OTPExpires: null }, { where: { email: email } });
        return res.status(200).json({ success: true, message: "Password Reset Successful" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: true, message: "Server Error" })
    }
};


const GetSuperAdminById = async (req, res) => {
    try {
        const { id } = req.decode || {}; // Ensure req.decode is not undefined

        if (!id) {
            return res.status(400).json({ success: false, message: "Invalid request: Missing ID" });
        }

        const superAdminData = await superAdmin.findByPk(id);

        if (!superAdminData) {
            return res.status(404).json({ success: false, message: "Super Admin not found" });
        }

        return res.status(200).json({ success: true, message: "Super Admin found", data: superAdminData });

    } catch (error) {
        console.error("Error in GetSuperAdminById:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};





module.exports = {
    Register,
    Login,
    resetPassword,
    superAdminForgotpassword,
    superAdminRecreatePassword,
    GetSuperAdminById



}