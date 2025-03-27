const ExcelJS=require('exceljs');
const express=require('express');
const CustomerRequest=require('../Models/CustomerRequest');
const customer=require('../Models/Customer');
const Driver=require('../Models/Driver');
const vehicle=require('../Models/Vehicle');
const Material=require('../Models/Material');
//const {op}=require('sequelize');
const { Op, Sequelize } = require('sequelize');
const path = require('path');

const PickUp=async(req,res)=>{
    try{
         // Fetch data for all statuses in a single query
         const allRequests=await CustomerRequest.findAll({
            where:{
                status:["completed","Requested","Assigned"],   // Fetch all relevant statuses
            },
            include:[
                {model:customer,as:"customer"},
                {model:Driver,as:"drivers"},
                {model:vehicle,as:"vehicles"},
            ],
         }) ;
          //Create a new Excel workbook and worksheet
          const workbook=new ExcelJS.Workbook();
          const worksheet=workbook.addWorksheet("collection Request Report");

         // Define the column structure

         worksheet.columns=[
            {header:"Request ID",key:"request_id",width:10},
            {header:"Customer ID",key:"customer_id",width:10},
            {header:"Customer Name",key:"customer_name",width:20},
            {header:"Customer Phone",key:"customer_phone",width:15},
            {header:"Material Type",key:"material_Type",width:15},
            {header:"Material ID",key:"material_Id",width:10},
            {header:"Material Weight",key:"material_weight",width:15},
            {header:"Location",key:"Location",width:20},
            {header:"Latitude",key:"latitude",width:15},
            {header:"Longitude",key:"longitude",width:15},
            {header:"Driver ID",key:"driver_id",width:10},
            {header:"Status",key:"status",width:"15"},
            {header:"Vehicle Registration",key:"vehicle_registration",width:20},
            {header:"Request Date",key:"request_Date",width:20},
            {header:"Remarks",key:"Remarks",width:25}
         ];
          // Add rows for all requests
          console.log(allRequests);
          allRequests.forEach((request)=>{
            worksheet.addRow({
                request_id:request.Request_id,
                customer_id:request.customer_id,
               customer_name: request.customer ? request.customer.name : "NA",
                customer_phone:request.customer?request.customer.Phone:"N/A",
                material_Type:request.material_Type,
                material_Id:request.material_Id,
                material_weight:request.Material_Weight,
                Location:request.Location,
                latitude:request.latitude,
                longitude:request.longitude,
                driver_id:request.driver_id,
                vehicle_registration: request.vehicles ? request.vehicles.Registration_no :"N/A",
                status:request.status,
                request_Date:request.Request_Date,
                Remarks:request.Remarks
            })
          })
console.log(allRequests);

            // Set response headers for download
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=CollectionRequestReport.xlsx");
            // Write to response stream
            await workbook.xlsx.write(res);
            res.end();
    //res.status(200).json({success:true,message:"Successful",data:allRequests})
    }catch(error){
        console.error("Error generating Excel report:",error);
        return res.status(500).json({success:false,message:"server Error"});
    }
};



const GenerateRequestOverviewReport = async (req, res) => {
    try {
        const request = await CustomerRequest.findAll({
            attributes: ['Request_id', 'customer_id', 'material_Type', 'Location', 'status', 'Request_Date'],
            include: {
                model: customer,
                as: "customer",
            },
        })
        // console.log("request",request);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Request OverView');

        worksheet.columns = [
            { header: 'Request ID', key: 'Request_id', width: 15 },
            { header: 'Customer ID', key: 'customer_id', width: 15 },
            { header: 'Material Type', key: 'Material_type', width: 20 },
            { header: 'Location', key: 'Location', width: 25 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Request Date', key: 'request_Date', width: 20 },
            { header: 'Customer Name', key: 'customer_name', width: 15 }
        ]
        request.forEach(request => {
            console.log(request);

            worksheet.addRow({
                Request_id: request.Request_id,
                customer_id: request.customer_id,
                customer_name: request.customer.name,
                Material_type: request.material_Type,
                Location: request.Location,
                status: request.status,
                request_Date: request.Request_Date
            });
        })
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', 'attachment;filename=request_overview.xlsx');
        await workbook.xlsx.write(res);
        res.end();
        // res.status(200).json({ success: true, mesage: "CustomerName", data: request })
    } catch (error) {
        console.log('Error generating Excel Report.', error);
        res.status(500).json({ error: 'Failed to generate Report' })
    }
};


const GenerateMaterialIntakereport=async(req,res)=>{
    try{
        // Fetch data with customer, driver, and vehicle details
        const completedRequests=await CustomerRequest.findAll({
            where:{status:'completed'},// Only completed requests
            include:[
                {model:customer,as:'customer'},
                {model:Driver,as:'drivers'},
                {model:vehicle,as:'vehicles'},
                {model:Material,as:'materials'}
            ]
        });
        // Create a new Excel workbook
        const workbook=new ExcelJS.Workbook();
        const worksheet=workbook.addWorksheet('Material Intake Report');

        // Define columns
        worksheet.columns=[
            {header:"request ID",key:"Request_id",width:10},
            {header:"Customer ID",key:"customer_id",width:10},
            {header:"Customer Name",key:"customer_name",width:20},
            {header:"Material Type",key:"material_Type",width:15},
            {header:"Material ID",key:"material_Id",width:10},
            {header:"Material Weight",key:"material_Weight",width:15},
            {header:"Source Location",key:"Location",width:20},
            {header:"Latitude",key:"latitude",width:15},
            {header:"Longitude",key:"longitude",width:15},
            {header:"Received Date",key:"CheckIn_time",width:20},
            {header:"Vehicle ID",key:"vehicle_id",width:10},
            {header:"Vehicle Registration", key: "vehicle_registration", width: 20 },
            {header:"Driver ID",key:"driver_id",width:10},
            {header:"Driver Name",key:"driver_name",width:20},
            {header:"Remarks",key:"Remarks",width:25}
        ]
       // Add data rows
       completedRequests.forEach(request=>{
        worksheet.addRow({
            Request_id:request.Request_id,
            customer_id:request.customer_id,
            customer_name:request.customer?request.customer.name:"NA",
            material_Type:request.material_Type,
            material_Id:request.material_Id,
            material_Weight:request.Material_Weight,
            Location:request.Location,
            latitude:request.latitude,
            longitude:request.longitude,
            CheckIn_time: request.CheckIn_time ? request.CheckIn_time: "NA",  // ✅ Format Date
            CheckIn_time: request.CheckIn_time instanceof Date
    ? request.CheckIn_time
    : request.CheckIn_time || "NA",

            vehicle_id: request.vehicles.id,
            vehicle_registration: request.vehicles ? request.vehicles.Registration_no : "NA",
            driver_id:request.driver_id,
            driver_name: request.drivers ? request.drivers.name : "NA",
            Remarks:request.Remarks
        })
       })
       // Set response headers
       res.setHeader("Content-Type","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
       res.setHeader("Content-Disposition","attachment;filename=Material_Intake_Report.xlsx");

        // Send the file
        await workbook.xlsx.write(res);
        res.end();
    // res.status(200).json({success:true,message:"done",data:completedRequests})
    }catch(error){
        console.error("Error generating Excelreport:",error);
        if(!res.headersSent){
        res.status(500).json({success:false,message:"Server Error"});
    }
    }
}


const GenerateMaterialRejectionReport=async(req,res)=>{
try{
    // Fetch rejected material data
    const rejectedMaterials=await CustomerRequest.findAll({
        where:{status:'Cancelled'},// Assuming 'Cancelled' indicates rejection
        include:[
            {model:customer,as:'customer'},
            {model:Material,as:'materials'}
        ]
    });
     // Create a new Excel workbook
     const Workbook=new ExcelJS.Workbook();
     const Worksheet=Workbook.addWorksheet('Material Rejection Report');
     // Define columns
     Worksheet.columns=[
        {header:"Request ID",key:"Request_id",width:10},
        {header:"Customer Name",key:"customer_name",width:20},
        {header:"Material Type",key:"material_Type",width:20},
        {header:"Material Weight",key:"Material_Weight",width:15},
        {header:"Rejection Reason",key:"rejection_reason",width:30},
        {header:"Rejection Date",key:"rejection_date",width:20}
     ];
      // Add data rows
      rejectedMaterials.forEach(request=>{
        // console.log(request);
        // console.log('CheckOut_time:',request.CheckOut_time);
        Worksheet.addRow({
            Request_id:request.Request_id,
            customer_name:request.customer?request.customer.name:"NA",
            material_Type: request.materials.Material_Name,
            Material_Weight:request.Material_Weight ||"NA",
            rejection_reason: request.Remarks || "Not Provided",
            rejection_date: request.CheckOut_time
            ? new Date(request.CheckOut_time).toLocaleDateString()
            : "NA"
       });
      });
      // Set response headers
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");


      // Send the file
      await Workbook.xlsx.write(res);
      res.end();
    //res.status(200).json({success:true,message:"Success",data:rejectedMaterials})
}catch(error){
    console.log("Error generating Rejection Report:", error);
    if(!res.headersSent){
        res.status(500).json({success:false,message:"Server Error"})
    }
}
}


const router=express.Router();
const generateInventoryStatusReport=async(req,res)=>{
    try{
        // Fetch inventory status data
        const inventoryData=await CustomerRequest.findAll({
            attributes:[
                'material_Type',
                'Location',
                'latitude',
                'longitude',
                'CheckIn_Location',
                'CheckIn_latitude',
                'CheckIn_longitude',
                'CheckOut_Location',
                'CheckOut_latitude',
                'CheckOut_longitude',
                'Material_Weight'
            ],
            include:[
                {
                    model:Material,
                    as:'materials',
                    attributes:['Material_Name']
                }
            ]
        });
        // Create a new Excel workbook
        const workbook=new ExcelJS.Workbook();
        const worksheet=workbook.addWorksheet('Inventory Status Report');

          // Define columns
          worksheet.columns=[
            //{header:"Material Name",key:"material_Name",width:25},
            {header:"Material Type",key:"material_Type",width:20},
            {header:"Location",key:"Location",width:25},
            {header:"Latitude",key:"latitude",width:15},
            {header:"Longitude",key:"longitude",width:15},
            {header:"CheckIn-Location",key:"CheckIn_Location",width:25},
            {header:"CheckIn-Latitude",key:"CheckIn_latitude",width:15},
            {header:"CheckIn-Longitude",key:"CheckIn_longitude",width:15},
            {header:"CheckOut-Location",key:"CheckOut_Location",width:25},
            {header:"CheckOut-Latitude",key:"CheckOut_latitude",width:15},
            {header:"CheckOut_Longitude",key:"CheckOut_longitude",width:15},
            {header:"Material-Weight",key:"Material_weight",width:15}
          ];
           // Add data rows
           inventoryData.forEach(request=>{
            worksheet.addRow({
               // Material_Name:request.material?request.material.Material_Name:"N/A",
                material_Type:request.material_Type,
                Location:request.Location||"NA",
                latitude:request.latitude||"NA",
                longitude:request.longitude||"NA",
                CheckIn_Location:request.CheckIn_Location||"NA",
                CheckIn_latitude:request.CheckIn_latitude||"NA",
                CheckIn_longitude:request.CheckIn_longitude||"NA",
                CheckOut_Location:request.CheckOut_Location||"NA",
                CheckOut_latitude:request.CheckOut_latitude||"NA",
                CheckOut_longitude:request.CheckOut_longitude||"NA",
                Material_weight:request.materials.Material_Weight||"NA"
            });
           })
           // Set response headers
           res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
          res.setHeader("Content-Disposition", "attachment; filename=InventoryStatusReport.xlsx");

          // Write the workbook to the response stream and end response
          await workbook.xlsx.write(res);
          res.end();
           //Return the workbook object for further processing (e.g., writing to response)
       return workbook;
        }catch(error){
            console.log("Error GeneratingInventory Status Report:",error);
            throw new Error("Error Generating Report");
        }
}

const generateInventoryTurnoverReport = async (req, res) => {
    try {
        // Fetch grouped data from CustomerRequest
        const reportData = await CustomerRequest.findAll({
            attributes: [
                'material_Type',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalRequests'],
                [Sequelize.fn('SUM', Sequelize.col('Material_Weight')), 'totalWeight'],
                [Sequelize.fn('MIN', Sequelize.col('CheckOut_time')), 'firstMovement'],
                [Sequelize.fn('MAX', Sequelize.col('CheckOut_time')), 'lastMovement']
            ],
            group: ['material_Type'],
            raw: true
        });

        if (reportData.length === 0) {
            return res.status(404).json({ message: "No data found for Inventory Turnover Report" });
        }

        // Create Excel workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Inventory Turnover Report');

        // Define columns
        worksheet.columns = [
            { header: 'Material Type', key: 'material_Type', width: 20 },
            { header: 'Total Requests', key: 'totalRequests', width: 15 },
            { header: 'Total Weight (kg)', key: 'totalWeight', width: 15 },
            { header: 'First Movement', key: 'firstMovement', width: 25 },
            { header: 'Last Movement', key: 'lastMovement', width: 25 },
            { header: 'Movement Duration (Days)', key: 'movementDuration', width: 20 },
            { header: 'Category (Fast/Slow)', key: 'category', width: 15 }
        ];

        // Process each row for classification
        reportData.forEach(row => {
            const firstMovement = row.firstMovement ? new Date(row.firstMovement) : null;
            const lastMovement = row.lastMovement ? new Date(row.lastMovement) : null;
            let movementDuration = 'N/A';
            let category = 'Unknown';

            if (firstMovement && lastMovement) {
                const durationInDays = Math.ceil((lastMovement - firstMovement) / (1000 * 60 * 60 * 24)); // Convert to days
                movementDuration = durationInDays;

                // Classify as Fast or Slow Moving
                if (row.totalRequests > 10 && durationInDays < 15) {
                    category = 'Fast-Moving';
                } else if (row.totalRequests <= 10 && durationInDays >= 15) {
                    category = 'Slow-Moving';
                } else {
                    category = 'Moderate';
                }
            }

            // Add row to worksheet
            worksheet.addRow({
                material_Type: row.material_Type,
                totalRequests: row.totalRequests,
                totalWeight: row.totalWeight || 0,
                firstMovement: firstMovement ? firstMovement.toLocaleString() : 'N/A',
                lastMovement: lastMovement ? lastMovement.toLocaleString() : 'N/A',
                movementDuration,
                category
            });
        });

     // Generate Excel file in memory
     const buffer = await workbook.xlsx.writeBuffer();

      // Set response headers
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=InventoryTurnoverReport.xlsx');

 // Send file as response
 res.send(Buffer.from(buffer));

        // // Save file and send response
        // await workbook.xlsx.writeFile(filePath);
        // res.download(filePath, 'InventoryTurnoverReport.xlsx');

    } catch (error) {
        console.error("Error generating Inventory Turnover Report:", error);
        res.status(500).json({ message: "Error generating Inventory Turnover Report", error: error.message });
    }
};


//Pranay
// const ExcelJS = require('exceljs');
// const fs = require('fs');
// const path = require('path');
// const CustomerRequest = require('../Models/CustomerRequest');
// const Material = require('../Models/Material');

const getCollectionReport = async (driverId) => {
    try {
        const completedTrips = await CustomerRequest.findAll({
            where: { driver_id: driverId, status: 'completed' },
            include: [{ model: Material, as:"material",attributes: ['Material_Name'] }]
        });

        if (!completedTrips.length) return [];

        let totalDistance = 0, totalPickupTime = 0, totalMaterialsCollected = 0;
        const totalTrips = completedTrips.length;

        const tripData = completedTrips.map(trip => {
            const startOdometer = parseFloat(trip.starting_OdoMeter_Reading) || 0;
            const endOdometer = parseFloat(trip.Ending_OdoMeter_Reading) || 0;
            const distance = Math.max(0, endOdometer - startOdometer);
            totalDistance += distance;

            const requestDate = trip.Request_Date ? new Date(trip.Request_Date) : null;
            const checkInTime = trip.CheckIn_time ? new Date(trip.CheckIn_time) : null;
            const pickupTimeHours = requestDate && checkInTime ? (checkInTime - requestDate) / (1000 * 60 * 60) : 0;
            totalPickupTime += pickupTimeHours;

            totalMaterialsCollected++;

            return {
                tripId: trip.id,
                materialType: trip.material ? trip.material.Material_Name : "N/A",
                distanceCovered:` ${distance.toFixed(2)} km`,
                pickupTime:` ${pickupTimeHours.toFixed(2)} hrs`
            };
        });

        return {
            tripData,
            avgPickupTime: `${(totalTrips ? totalPickupTime / totalTrips : 0).toFixed(2)} hrs`,
            avgDistanceCovered: `${(totalTrips ? totalDistance / totalTrips : 0).toFixed(2)} km`,
            totalMaterialsCollected
        };

    } catch (error) {
        console.error("❌ Error fetching trip metrics report:", error);
        throw error;
    }
};

const generateCollectionReportExcel = async (req, res) => {
    try {
        console.log("Received Driver ID:", req.params.id);
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "Driver ID is required" });

        const reportData = await getCollectionReport(id);

        if (!reportData.tripData.length) {
            return res.status(404).json({ message: "No completed trips found for this driver" });
        }

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Trip Metrics');

        // *Header Row - All Side by Side*
        sheet.addRow([
            "Average Pickup Time",
            "Average Distance Covered",
            "Total Materials Collected",
            "Trip ID",
            "Material Type",
            "Distance Covered",
            "Pickup Time"
        ]).font = { bold: true };

        // *Data Row - All Side by Side*
        reportData.tripData.forEach(trip => {
            sheet.addRow([
                reportData.avgPickupTime,
                reportData.avgDistanceCovered,
                reportData.totalMaterialsCollected,
                trip.tripId,
                trip.materialType,
                trip.distanceCovered,
                trip.pickupTime
            ]);
        });

        // *Auto-adjust column width*
        sheet.columns.forEach(column => {
            column.width = 25;
        });

        // *Send file directly to response without saving*
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=collectionReport_${id}.xlsx`
        );
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        await workbook.xlsx.write(res);
        res.end(); // End response after writing


    } catch (error) {
        console.error("❌ Error generating Trip Metrics Report Excel:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



// Function to get driver summary report
const getDriverSummaryReport = async (driverId) => {
    try {
        const driver = await Driver.findByPk(driverId);
        if (!driver) return null;

        const completedTrips = await CustomerRequest.findAll({
            where: { driver_id: driverId, status: 'completed' }
        });

        let totalDistance = 0;
        let totalMaterialsTransported = 0;

        completedTrips.forEach(request => {
            const startOdometer = parseFloat(request.starting_OdoMeter_Reading) || 0;
            const endOdometer = parseFloat(request.Ending_OdoMeter_Reading) || 0;

            console.log(`Trip ID: ${request.id}, Start: ${startOdometer}, End: ${endOdometer}`);

            if (endOdometer >= startOdometer) {
                totalDistance += endOdometer - startOdometer;
            } else {
                console.warn(`⚠ Odometer values invalid for Trip ID: ${request.id}`);
            }

            totalMaterialsTransported += 1;
        });


        return {
            driverId: driver.id,
            driverName: driver.name,
            totalTrips: completedTrips.length,
            totalDistance:` ${totalDistance.toFixed(2)} km`,
            totalMaterialsTransported
        };
    } catch (error) {
        console.error("Error fetching driver summary report:", error);
        throw error;
    }
};

// Function to generate the driver summary Excel report
const generateDriverSummaryExcel = async (req, res) => {
    try {
        const { driverId } = req.params;
        const report = await getDriverSummaryReport(driverId);

        if (!report) {
            return res.status(404).json({ message: "Driver not found" });
        }

        const workbook = new ExcelJS.Workbook();
        const summarySheet = workbook.addWorksheet('Driver Summary');
        summarySheet.addRow(['Driver ID', 'Driver Name', 'Total Trips', 'Total Distance', 'Total Materials Transported']).font = { bold: true };
        summarySheet.addRow([report.driverId, report.driverName, report.totalTrips, report.totalDistance, report.totalMaterialsTransported]);

         // Generate Excel file in memory
         const buffer = await workbook.xlsx.writeBuffer();

          // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Driver_Summary_Report_${driverId}.xlsx`);

        // Send file as response
        res.send(Buffer.from(buffer));

    } catch (error) {
        console.error("Error generating Driver Summary Report Excel:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Function to get trip details report
const getTripDetailsReport = async (driverId) => {
    try {
        const completedTrips = await CustomerRequest.findAll({
            where: { driver_id: driverId, status: 'completed' },
            include: [{ model: Material, as: 'material', attributes: ['Material_Name'] }] // Use the alias
        });

        return completedTrips.map(trip => {
            const startOdometer = parseFloat(trip.starting_OdoMeter_Reading) || 0;
            const endOdometer = parseFloat(trip.Ending_OdoMeter_Reading) || 0;
            const distance = Math.max(0, endOdometer - startOdometer);

            // Calculate Weighbridge Value
            const vehicleEmptyWeight = parseFloat(trip.Vehicle_Empty_Weight) || 0;
            const vehicleLoadWeight = parseFloat(trip.Vehicle_Load_Weight) || 0;
            const weighbridge = Math.max(0, vehicleLoadWeight - vehicleEmptyWeight);

            return {
                tripId: trip.id,
                materialType: trip.material ? trip.material.Material_Name : "N/A",
                startOdometer,
                endOdometer,
                distanceCovered: `${distance.toFixed(2)} km`,
                checkInTime: trip.CheckIn_time
                    ? new Date(trip.CheckIn_time).toLocaleString('en-GB', { hour12: false })
                    : "N/A",
                checkOutTime: trip.CheckOut_time
                    ? new Date(trip.CheckOut_time).toLocaleString('en-GB', { hour12: false })
                    : "N/A",
                weighbridge: `${weighbridge.toFixed(2)} kg`
            };
        });
    } catch (error) {
        console.error("Error fetching trip details report:", error);
        throw error;
    }
};

// Function to generate trip details Excel report
const generateTripDetailsExcel = async (req, res) => {
    try {
        const { driverId } = req.params;
        const tripDetails = await getTripDetailsReport(driverId);

        if (!tripDetails.length) {
            return res.status(404).json({ message: "No completed trips found for this driver" });
        }

        const workbook = new ExcelJS.Workbook();
        const tripSheet = workbook.addWorksheet('Trip Details');
        tripSheet.addRow([
            'Trip ID', 'Material Type', 'Starting Odometer', 'Ending Odometer',
            'Distance Covered', 'Check-In Time', 'Check-Out Time', 'Weighbridge (kg)'
        ]).font = { bold: true };

        tripDetails.forEach(trip => {
            tripSheet.addRow([
                trip.tripId,
                trip.materialType,
                trip.startOdometer,
                trip.endOdometer,
                trip.distanceCovered,
                trip.checkInTime,
                trip.checkOutTime,
                trip.weighbridge
            ]);
        });

        // Set column formats (date-time)
        tripSheet.getColumn(6).numFmt = 'dd-mm-yyyy hh:mm:ss';
        tripSheet.getColumn(7).numFmt = 'dd-mm-yyyy hh:mm:ss';

        const filePath = path.join(__dirname, `Trip_Details_Report_${driverId}.xlsx`);
       // await workbook.xlsx.writeFile(filePath);

        // res.download(filePath,`Trip_Details_Report_${driverId}.xlsx`, (err) => {
        //     if (err) {
        //         console.error("Error downloading file:", err);
        //         res.status(500).send("Error downloading the file");
        //     }
        //     //fs.unlinkSync(filePath);
        // });
        // return res.status(200).json({message:"Data",data:tripDetails})
    } catch (error) {
        console.error("Error generating Trip Details Report Excel:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



const generateDriverAttendanceReport = async (req, res) => {
    try {
        const records = await CustomerRequest.findAll({
            attributes: ['driver_id', 'CheckIn_time', 'CheckOut_time'],
            include: [{ model: Driver, as: 'driver', attributes: ['id', 'name'] }],
            order: [['CheckIn_time', 'ASC']]
        });

        const driverData = {};
        records.forEach(record => {
            if (!record.driver_id) return; // Skip if no driver assigned

            const driverId = record.driver_id;
            const driverName = record.driver ? record.driver.name : "Unknown";

            const checkInTime = record.CheckIn_time ? new Date(record.CheckIn_time).toLocaleTimeString() : "N/A";
            const checkOutTime = record.CheckOut_time ? new Date(record.CheckOut_time).toLocaleTimeString() : "N/A";

            const checkInDate = record.CheckIn_time ? new Date(record.CheckIn_time).toLocaleDateString() : null;
            const checkOutDate = record.CheckOut_time ? new Date(record.CheckOut_time).toLocaleDateString() : null;

            if (!driverData[driverId]) {
                driverData[driverId] = {
                    driverName,
                    checkIns: [],
                    checkOuts: [],
                    attendanceDays: new Set()
                };
            }

            driverData[driverId].checkIns.push(checkInTime);
            driverData[driverId].checkOuts.push(checkOutTime);
            if (checkInDate) driverData[driverId].attendanceDays.add(checkInDate);
            if (checkOutDate) driverData[driverId].attendanceDays.add(checkOutDate);
        });

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Driver Attendance Report');

        sheet.addRow(['Driver ID', 'Driver Name', 'Check-In Times', 'Check-Out Times', 'Attendance Days']).font = { bold: true };

        Object.entries(driverData).forEach(([driverId, data]) => {
            sheet.addRow([
                driverId,
                data.driverName,
                data.checkIns.join(", "),
                data.checkOuts.join(", "),
                [...data.attendanceDays].join(", ")
            ]);
        });

        // Write the Excel file to a buffer (in-memory)
        const buffer = await workbook.xlsx.writeBuffer();

        // Set headers and send response
        res.setHeader('Content-Disposition', 'attachment; filename="Driver_Attendance_Report.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);

    } catch (error) {
        console.error("Error generating driver report:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports={PickUp,GenerateRequestOverviewReport,GenerateMaterialIntakereport,GenerateMaterialRejectionReport,generateInventoryStatusReport,generateInventoryTurnoverReport,generateDriverSummaryExcel,generateCollectionReportExcel,generateTripDetailsExcel,generateDriverAttendanceReport };

