const express = require('express');
const router = express.Router();
const SuperAdmin = require('../Controllers/SuperAdmin');
const token_verify = require('../Middlewares/verifyToken');
const upload = require('../Middlewares/S3Multer').upload('Profile');
const Admin = require('../Controllers/Admin');

router.post('/register', upload.single('Profile_pic'), SuperAdmin.Register);
router.post('/Login', SuperAdmin.Login);
router.patch('/UpdateAdmin/:id', token_verify, Admin.updateAdmin);
router.get('/getAdmin', token_verify, Admin.GetAdmin);
router.get('/getAllAdmins', token_verify, Admin.GetAllAdmins);
router.post('/ResetPassword',SuperAdmin.resetPassword);
router.get('/getsuperAdminbyID',token_verify,SuperAdmin.GetSuperAdminById);
router.post('/SuperAdminForgotpassword',SuperAdmin.superAdminForgotpassword);
router.post('/SuperAdminRecreatePassword',SuperAdmin.superAdminRecreatePassword);

module.exports = router;