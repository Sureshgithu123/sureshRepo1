const CustomerRequest = require('../Models/CustomerRequest');
const filterAndPaginate = require('../Middlewares/Pagination');
const Customer = require('../Models/Customer');
const Driver = require('../Models/Driver');


const createRequest = async (req, res) => {
    try {
        const requiredFields = ["customer_id", "material_Id", "latitude", "longitude"];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(", ")}`
            });
        }

        const requestData = {
            customer_id: req.body.customer_id,
            description: req.body.description,
            material_Type: req.body.material_Type,
            material_Id: req.body.material_Id,
            location: req.body.Location,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
           Request_id: req.body.Request_id,
        };

        const request = await CustomerRequest.create(requestData);

        return res.status(201).json({
            success: true,
            message: "Request created successfully",
            data: request
        });

    } catch (error) {
        console.error("Error in createRequest:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later.",
            error: error.message
        });
    }
};



const getAllRequests = async (req, res) => {
    try {
        const populate = [
            { model: Customer, as: 'customers' },
            { model: Driver, as: 'drivers' }
        ]
        const requests = await filterAndPaginate(CustomerRequest, req.query, '', populate);

        res.status(200).json({ success: true, ...requests });
    } catch (error) {
        console.log(error);

        res.status(500).json({ success: false, message: error.message });
    }
    /*
        #swagger.parameters['search'] = { in: 'query', type: 'string', description: 'Search across fields' }
        #swagger.parameters['page'] = { in: 'query', type: 'integer', default: 1 }
        #swagger.parameters['limit'] = { in: 'query', type: 'integer', default: 10 }
    */
};

const getRequestById = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await CustomerRequest.findByPk(id, {
            include: [
                { model: Customer, as: 'customers' },
                { model: Driver, as: 'drivers' }
            ]
        });
        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        res.status(200).json({ success: true, data: request });
    } catch (error) {
        console.error("Error in getRequestById:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getTransactions = async (req, res) => {
    try {
        // Preserve existing query parameters while enforcing status = "completed"
        req.query = { ...req.query, status: "completed" };

        const transactions = await filterAndPaginate(CustomerRequest, req.query);

        return res.status(200).json({ success: true, data: transactions });
    } catch (error) {
        console.error("Error in getTransactions:", error);
        res.status(500).json({ success: false, message: error.message });
    }
    /*
        #swagger.parameters['search'] = { in: 'query', type: 'string', description: 'Search across fields' }
        #swagger.parameters['page'] = { in: 'query', type: 'integer', default: 1 }
        #swagger.parameters['limit'] = { in: 'query', type: 'integer', default: 10 }
    */
};


module.exports = {
    createRequest,
    getAllRequests,
    getRequestById,
    getTransactions
}