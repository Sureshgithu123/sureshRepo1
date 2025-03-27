const express = require('express');
const router = express.Router()
const Material = require('../Controllers/Material');
const token_verify = require('../Middlewares/verifyToken');

router.post('/CreateMaterial', token_verify, Material.createMaterial);
router.get('/GetMaterials', token_verify, Material.getMaterials);
router.get('/GetMaterialById/:id', token_verify, Material.getMaterialbyId);
router.put('/UpdateMaterial/:id', token_verify, Material.updateMaterial);
router.get('/getRequestsById', token_verify, Material.getRequestsById);

module.exports = router;