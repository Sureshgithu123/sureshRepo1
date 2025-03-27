const express = require('express');
const router = express.Router();
const Admin = require('../Controllers/Admin');
const token_verify = require('../Middlewares/verifyToken');
const upload = require('../Middlewares/S3Multer').upload('Profile');

router.post('/adminRegister', upload.single('Profile_pic'), token_verify, Admin.AdminRegister);
router.post('/adminLogin', Admin.AdminLogin);
router.post('/adminResetpassword', token_verify, Admin.AdminResetpassword);
router.post('/adminForgotpassword', Admin.AdminForgotpassword);
router.post('/adminRecreatePassword', Admin.AdminRecreatePassword);
router.get('/GetAdminByid', token_verify, Admin.GetAdminByid);
router.patch('/updateAdminById',upload.single('Profile_pic'), token_verify, Admin.updateAdminById);
router.patch('/AssignRequest', token_verify, Admin.AssignRequest);
router.patch('/CompleteRequest', token_verify, Admin.CompleteRequest);

module.exports = router;