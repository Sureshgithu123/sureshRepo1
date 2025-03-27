const Express=require('express');
const { Sequelize } = require('sequelize');
const CustomerRequest=require('../Models/CustomerRequest');
const Customer=require('../Models/Customer');
const Driver=require('../Models/Driver');
const Vehicle=require('../Models/Vehicle');
const Material=require('../Models/Material');

const getCounts=async(req,res)=>{
    try{
        const {id}=req.decode
            //fetch requests for CustomerRequest,Materials,vehicles,customers

            const totalCustomerRequests = await CustomerRequest.count({
                where: {Admin_id:id}
            });
            const totalCustomers=await Customer.count();
            const totalDrivers=await Driver.count({
                where :{createdBy:id}
            });
            const totalVehicles=await Vehicle.count({
                where :{createdBy:id}
            });

            return res.status(200).json({success:true,message:"Counts calculated Successfully",
                data:{
                    totalCustomerRequests,
                    totalCustomers,
                    totalDrivers,
                    totalVehicles
                }
            });
    }catch(error){
        console.error('Error fetching Counts:',error);
        return res.status(500).json({sucess:false,message:"Server Error"})
    }
};

const getTripCounts = async (req, res) => {
    try {
        const { id: Admin_id } = req.decode; // Extract adminId from decoded token

        // Fetch trip counts filtered by adminId
        const tripCounts = await CustomerRequest.findAll({
            attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('status')), 'count']],
            where: { Admin_id }, // Filter by adminId
            group: ['status'],
        });
       // console.log(tripCounts);

        // Initialize status summary with default values
        const statusSummary = {
            Requested: 0,
            Assigned: 0,
            Accepted: 0,
            Picked: 0,
            completed: 0,
            cancelled: 0
        };

        // Populate actual counts
        tripCounts.forEach(trip => {
            statusSummary[trip.status] = trip.getDataValue('count');
        });

        return res.status(200).json({
            success: true,
            message: "Status of trips count fetched successfully",
            data: statusSummary
        });
    } catch (error) {
        console.error("Error fetching status counts:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};


const getMaterialWeightPercentage = async (req, res) => {
    try {
        const { id } = req.decode; // Extract adminId from decoded token

        // Step 1: Get total weight of all materials combined for this admin
        const totalWeightData = await Material.findOne({
            attributes: [[Sequelize.fn("SUM", Sequelize.col("Total_Weight")), "totalWeight"]],
            where: { createdBy: id } // Filter by createdBy (adminId)
        });

        const totalWeight = totalWeightData?.dataValues?.totalWeight || 0;

        if (totalWeight === 0) {
            return res.status(200).json({
                success: true,
                message: "No material weight data found",
                data: [],
            });
        }

        // Step 2: Get weight of each material filtered by adminId
        const materialWeights = await Material.findAll({
            attributes: [
                "Material_Name",
                [Sequelize.col("Total_Weight"), "materialWeight"]
            ],
            where: { createdBy: id } // Filter by createdBy
        });

        // Step 3: Calculate weight percentage for each material
        const materialPercentageData = materialWeights.map((entry) => {
            const materialName = entry.getDataValue("Material_Name");
            const materialWeight = parseFloat(entry.getDataValue("materialWeight")) || 0;

            return {
                material: materialName,
                weight: materialWeight,
                percentage: (
                    (materialWeight / totalWeight) * 100
                ).toFixed(2) + "%"  // This is formatted differently but does the same thing.
            };
        });

        return res.status(200).json({
            success: true,
            message: "Material weight percentages fetched successfully",
            data: materialPercentageData,
        });
    } catch (error) {
        console.error("Error fetching material weight percentages:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};






module.exports={getCounts,getTripCounts,getMaterialWeightPercentage};