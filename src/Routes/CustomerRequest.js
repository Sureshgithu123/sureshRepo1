const express = require('express');
const router = express.Router();
const CustomerRequest = require('../Controllers/CustomerRequest');
const token_verify = require('../Middlewares/verifyToken');


router.post('/createRequest', CustomerRequest.createRequest);
router.get('/requests',token_verify, CustomerRequest.getAllRequests);
router.get('/request/:id',token_verify, CustomerRequest.getRequestById);
router.get('/getTransactions',token_verify, CustomerRequest.getTransactions);

module.exports = router;