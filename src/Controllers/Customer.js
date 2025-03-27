const filterAndPaginate = require('../Middlewares/Pagination');
const customer = require('../Models/Customer');
const CustomerRegister = async (req, res) => {
    try {
        const { name, Phone } = req.body

        const existphone = await customer.findOne({ where: { Phone } });

        if (existphone) return res.status(201).json({ Success: true, message: "Phone Number Already exist" });
        const Customer = await customer.create({ name, Phone });

        return res.status(201).json({ success: true, message: "Customer Created Successfully", data: Customer });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server Error" })
    }
}

//get Customer list
const GetAllCustomers = async (req, res) => {
    // const { id } = req.decode;
    try {
        const Customer = await filterAndPaginate(customer, req.query);
        return res.status(201).json({ success: true, message: "Customers List fetched Successfully", ...Customer });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Server Error" });
    }
    /*
        #swagger.parameters['search'] = { in: 'query', type: 'string', description: 'Search across fields' }
        #swagger.parameters['page'] = { in: 'query', type: 'integer', default: 1 }
        #swagger.parameters['limit'] = { in: 'query', type: 'integer', default: 10 }
    */
}


//get CustomerBy IdS    
const GetCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const Customer = await customer.findByPk(id);
        if (!Customer) {
            return res.status(201).json({ success: false, message: "Customer not found" });
        }
        return res.status(201).json({ success: true, message: "Customer Found", data: Customer });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Server Error" })
    }
}


//Update Customer
const UpdateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, Phone, Status } = req.body;
        const existingcustomer = await customer.findByPk(id);
        if (!existingcustomer) return res.status(401).json({ success: false, message: "Customer not found" });
        const [updatedRowsCount] = await customer.update({ name, Phone, Status }, { where: { id } });
        if (updatedRowsCount === 0) {
            return res.status(401).json({ success: false, message: "Customer not updated" })
        } const UpdatedCustomer = await customer.findByPk(id);
        return res.status(201).json({ success: true, message: "Customer Updated Successfully", data: UpdatedCustomer })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Server Error" })
    }
}
module.exports = {
    CustomerRegister,
    GetAllCustomers,
    GetCustomer,
    UpdateCustomer
}