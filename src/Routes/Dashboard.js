const Express=require('express');
const router=Express.Router();
const {getCounts,getTripCounts,getMaterialWeightPercentage}=require('../Controllers/Dashboard');
const token_verify=require('../Middlewares/verifyToken');

router.get ('/Counts',token_verify,getCounts);
router.get('/tripStatusCounts',token_verify,getTripCounts);
router.get('/materialsWeightPercentage',token_verify,getMaterialWeightPercentage);

module.exports=router;