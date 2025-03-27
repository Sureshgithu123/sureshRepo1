const express = require('express');
const router = express.Router();
const Customer = require('../Controllers/Customer');
const token_verify = require('../Middlewares/verifyToken');

router.post('/customerRegister', Customer.CustomerRegister);
router.get('/getAllCustomers', token_verify, Customer.GetAllCustomers);
router.get('/getCustomer/:id', token_verify, Customer.GetCustomer);
router.patch('/UpdateCustomer/:id', token_verify, Customer.UpdateCustomer);

module.exports = router;