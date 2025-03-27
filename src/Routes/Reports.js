const express=require('express');
const router=express.Router();
const token_verify = require('../Middlewares/verifyToken');

const{PickUp}=require('../Controllers/Reports');
 const {GenerateRequestOverviewReport}= require('../Controllers/Reports');
const {GenerateMaterialIntakereport} =require('../Controllers/Reports');
const {GenerateMaterialRejectionReport}=require('../Controllers/Reports');
const {generateInventoryStatusReport}=require('../Controllers/Reports');
const {generateInventoryTurnoverReport}=require('../Controllers/Reports');
//pranav
const { generateCollectionReportExcel,generateDriverSummaryExcel } = require('../Controllers/Reports');
const { generateTripDetailsExcel } = require('../Controllers/Reports');
const { generateDriverAttendanceReport} = require('../Controllers/Reports');



router.get('/CollectionRequestReport',token_verify,PickUp);
router.get('/Download-Summary-Report',token_verify, GenerateRequestOverviewReport);
router.get('/download-material-intake',token_verify,GenerateMaterialIntakereport);
router.get('/download-material-rejection',token_verify,GenerateMaterialRejectionReport);
router.get("/download-Inventory-Status-Report",token_verify,generateInventoryStatusReport);
router.get("/download-Inventory-TurnOver-Report",token_verify,generateInventoryTurnoverReport);

//pranav
router.get('/driver-report/:driverId',token_verify, generateDriverSummaryExcel);
router.get('/trip-report/:driverId',token_verify, generateTripDetailsExcel);
router.get('/Attendace-report/:id',token_verify, generateDriverAttendanceReport);
router.get('/CollectionReport/:id',token_verify,generateCollectionReportExcel);


module.exports=router;