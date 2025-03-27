const jwt = require('jsonwebtoken');

commonPaths = [

]
SuperAdminPaths = [
    "/adminRegister",
    "/getAllAdmins",
    "/getAdmin/:id",
    "/updateAdmin/:id",
    "/getSignedImage",
    "/getsuperAdminbyID"
]
AdminPaths = [
    "/CreateVehicle",
    "/UpdateVehicle/:id",
    "/GetVehicles",
    "/VehicleById/:id",
    "/CreateMaterial",
    "/GetMaterials",
    "/GetMaterialById/:id",
    "/UpdateMaterial/:id",
    "/getAllCustomers",
    "/getCustomer/:id",
    "/UpdateCustomer/:id",
    "/UpdateCustomer/:id",
    "/getDriverbytoken",
    "/Drivers",
    "/Drivers/:id",
    "/getRequestsById",
    "/registerDriver",
    "/Drivers/:id",
    "/Drivers",
    "/getDriverbytoken",
    "/requests",
    "/request/:id",
    "/requests/:customer_id",
    "/getTransactions",
    "/AssignRequest",
    "/adminResetpassword",
    "/GetAdminByid",
    "/updateAdminById",
    "/CollectionRequestReport",
    "/Download-Summary-Report",
    "/download-material-intake",
    "/download-material-rejection",
    "/download-Inventory-Status-Report",
    "/download-Inventory-TurnOver-Report",
    "/driver-report/:driverId",
    "/trip-report/:driverId",
    "/Attendace-report/:id",
    "/CollectionReport/:id",
    "/getSignedImage",
    "/Counts",
    "/tripStatusCounts",
    "/materialsWeightPercentage",
    "/CompleteRequest",
    "/createRequest"
]
DriverPath = [
    "/checkinTrip",
    "/getDriverbytoken",
    "/CheckoutTrip",
    "/RejectTrip",
    "/ChangeDriverStatus",
    "/updatePickupData",
    "/getCustomerRequests",
    "/getSignedImage",
]




const token_verify = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ success: false, message: "Token was not found" });
        }

        const Token = req.headers.authorization.replace("Bearer ", "");

        let jwtSecretKey = process.env.JWT_SECRET;

        let decode = jwt.verify(Token, jwtSecretKey);

        if (decode.role === "SuperAdmin" && !SuperAdminPaths.includes(req.route.path)) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        else if (decode.role === "Admin" && !AdminPaths.includes(req.route.path)) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        else if (decode.role === "Driver" && !DriverPath.includes(req.route.path)) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        req.decode = decode;
        next();
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message, message: "token Error" });
    }
}

module.exports = token_verify;