const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

const connectDB = async (req) => {
    sequelize = new Sequelize(
        process.env.MYSQL_DATABASE,
        process.env.MYSQL_USER,
        process.env.MYSQL_PASSWORD,
        {
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT || 3306,
            dialect: "mysql",
            logging: false,
        }
    );

    try {
        await sequelize.authenticate();
        //await sequelize.sync({ alter: true });
        console.log("Connected to MySQL successfully!");
      } catch (error) {
        console.error("MySQL connection failed:", error.message);
        process.exit(1);
      }
}

const getSequelize = () => sequelize;

module.exports = { connectDB, getSequelize };