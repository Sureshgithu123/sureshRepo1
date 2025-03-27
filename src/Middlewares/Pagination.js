const filterAndPaginate = async (model, query, createdBy, populate) => {
    
    let { page = 1, limit = 10, search, ...filters } = query;

    page = parseInt(page);
    limit = parseInt(limit);

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (createdBy) {
        whereClause.createdBy = createdBy;
    }
    // Dynamic Filtering
    for (let key in filters) {
        if (filters[key]) {
            whereClause[key] = filters[key]; // Customize this based on requirements
        }
    }

    // Search Logic (Adjust based on your schema)
    if (search) {
        whereClause.name = { $regex: search, $options: "i" };
    }

    // Get Total Records Count
    const totalRecords = await model.count({ where: whereClause });
    
    // Fetch Paginated Data
    const data = await model.findAll({
        where: whereClause,
        offset,
        limit,
        include: populate
    });

    // Calculate Total Pages
    const totalPages = Math.ceil(totalRecords / limit);

    return { data, totalRecords, totalPages, limit, page };
};

module.exports = filterAndPaginate;
