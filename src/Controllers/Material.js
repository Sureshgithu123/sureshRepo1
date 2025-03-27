const Material = require('../Models/Material');
const CustomerRequest = require('../Models/CustomerRequest');

const createMaterial = async (req, res) => {
    try {
        const { Material_Name } = req.body;
        const { id } = req.decode;
        const existingMaterial = await Material.findOne({ where: { Material_Name: Material_Name } });
        if (existingMaterial) return res.status(401).json({ success: false, message: "Material already exist" })
        const material = await Material.create({ Material_Name, createdBy: id });
        return res.status(201).json({ success: true, message: "material created successfully", data: material })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Server error" })
    }
}

//get MaterialList
const getMaterials = async (req, res) => {
    try {
        const Materials = await Material.findAll();
        return res.status(201).json({ success: true, message: "Materials fetched  Successfully", data: Materials })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ Sucess: false, message: "Server error" })
    }
}

//get Materialby Id 
const getMaterialbyId = async (req, res) => {
    try {
        const { id } = req.params;
        const material = await Material.findByPk(id);
        if (!material) {
            return res.status(401).json({ Success: true, message: "Material not found" });
        }
        return res.status(201).json({ success: true, message: "Material found", data: material });
    } catch (error) {
        return res.status(500).json({ success: true, message: "Server error" })
    }
}

//Update material
const updateMaterial = async (req, res) => {
    try {
        const { Material_Name } = req.body;
        const { id } = req.params;
        const existingMaterial = await Material.findByPk(id);
        if (!existingMaterial) return res.status(401).json({ success: false, message: "Material not found" });
        const [updatedRowsCount] = await Material.update({ Material_Name }, { where: { id } });
        if (updatedRowsCount === 0) {
            return res.status(401).json({ success: true, message: "Materials not updated" });
        }
        return res.status(201).json({ success: true, message: "Material updated Sucvcessfully", data: existingMaterial })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Server error" })
    }
};

const getRequestsById = async (req, res) => {
    try {
        const { Material_id } = req.query;
        const Requests = await CustomerRequest.findAll({
            where: {
                material_Id: Material_id
            }
        });
        return res.status(200).json({ success: true, Requests });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

// Export all functions
module.exports = {
    createMaterial,
    getMaterials,
    getMaterialbyId,
    updateMaterial,
    getRequestsById
}
