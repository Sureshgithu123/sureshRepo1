const express = require('express');
const router = express.Router();
const S3Image = require('./S3Image');
const SuperAdmin = require('./SuperAdmin');
const Admin = require('./Admin');
const Driver = require('./Driver');
const Material = require('./Material');
const Vehicle = require('./Vehicle');
const Customer = require('./Customer');
const CustomerRequest = require('./CustomerRequest');
const Dashboard = require('./Dashboard');
const Reports  = require('./Reports');

router.use('/S3Image', S3Image /* #swagger.tags = ['S3Image'] */);
router.use('/SuperAdmin', SuperAdmin /* #swagger.tags = ['SuperAdmin'] */);
router.use('/Admin', Admin /* #swagger.tags = ['Admin'] */);
router.use('/Dashboard', Dashboard /* #swagger.tags=['Dashboard'] */);
router.use('/Vehicle', Vehicle /* #swagger.tags = ['Vehicle'] */);
router.use('/Material', Material /* #swagger.tags = ['Material'] */);
router.use('/Driver', Driver /* #swagger.tags = ['Driver'] */);
router.use('/Customer', Customer /* #swagger.tags=['Customer'] */);
router.use('/Reports', Reports /* #swagger.tags=['Reports'] */);

router.use('/CustomerRequest', CustomerRequest /* #swagger.tags=['CustomerRequest'] */);



module.exports = router;