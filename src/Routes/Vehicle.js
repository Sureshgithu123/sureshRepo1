const express=require('express');
const router=express.Router()
const vehicle=require('../Controllers/Vehicle');
const token_verify = require('../Middlewares/verifyToken');

router.post('/CreateVehicle',token_verify,vehicle.createVehicle);
router.put('/UpdateVehicle/:id',token_verify,vehicle.updateVehicle);
router.get('/GetVehicles',token_verify,vehicle.getVehicles);
router.get('/VehicleById/:id',token_verify,vehicle.vehicleById);

module.exports=router;