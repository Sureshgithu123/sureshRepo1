const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.hashPassword = async (password) => {
    const saltKey = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, saltKey);
}

exports.isPasswordMatch = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}

exports.generateToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};
exports.generateRefreshToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: process.env.REFRESH_JWT_EXPIRES_IN })
};

exports.generateOtp = () => {
    return crypto.randomInt(100000, 1000000).toString();
};