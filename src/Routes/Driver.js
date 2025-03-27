const express = require('express');
const router = express.Router();
const Driver = require('../Controllers/Driver');
const token_verify = require('../Middlewares/verifyToken');

router.post('/registerDriver', token_verify, Driver.register);
router.post('/DriverLogin', Driver.Login);
router.put('/Drivers/:id', token_verify, Driver.updateDriver);
router.get('/Drivers', token_verify, Driver.getAllDrivers);
router.get('/Drivers/:id', token_verify, Driver.getDriverById);
router.get('/getDriverbytoken', token_verify, Driver.getDriverBytoken);
router.patch('/checkinTrip', token_verify, Driver.CheckinTrip);
router.patch('/CheckoutTrip', token_verify, Driver.CheckoutTrip);
router.patch('/RejectTrip', token_verify, Driver.RejectTrip);
router.patch('/ChangeDriverStatus', token_verify, Driver.ChangeDriverStatus);
router.patch('/updatePickupData', token_verify, Driver.updatePickupData);
router.get('/getCustomerRequests', token_verify, Driver.getCustomerRequests);


module.exports = router;