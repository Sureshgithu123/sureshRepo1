const swaggerAutogen = require("swagger-autogen")();
require("dotenv").config();

const DOMAIN = process.env.APP_URL || "http://localhost:5000";

const doc = {
  info: {
    title: "IRMS - Integrated Recycling Management System",
    description: "Description",
  },
  host: DOMAIN.split("/")[2],
  basePath: "/",
  schemes: ["http"],
  // schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "authorization",
      scheme: "bearer",
      in: "header",
      description: "Ex: Bearer 14213841804v323v3....",
    },
  },
};

const outputFile = "./swagger-output.json";
const routes = ['./src/Routes/routes.js'];

const generateDocs = async () => {
  await swaggerAutogen(outputFile, routes, doc);
  console.log("Swagger documentation generated!");
};

generateDocs();
