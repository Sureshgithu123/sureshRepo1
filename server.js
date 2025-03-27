require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
// const { sanitize } = require("express-validator");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectDB, getSequelize } = require("./src/config/database");
const checkMaintenanceMode = require("./src/Middlewares/maintenanceModeMiddleware");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger-output.json");

const app = express();

// Security Middleware
// app.use(
//   helmet({
//     contentSecurityPolicy: false,
//     frameguard: { action: "deny" },
//     referrerPolicy: { policy: "strict-origin-when-cross-origin" },
//     noSniff: true,
//   })
// );
// app.use(sanitize());
// app.use(hpp());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Apply maintenance mode globally
app.use(checkMaintenanceMode);

// Rate Limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: process.env.RATE_LIMIT || 500,
//   message: "Too many requests from this IP, please try again later.",
//   headers: true,
// });
// app.use(limiter);

// Enable Swagger only in development
if (process.env.NODE_ENV === "development") {
  app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { validatorUrl: null }));
  console.log(`Swagger documentation available at: ${process.env.APP_URL}/doc`);
}

// Database Connection
connectDB();
const sequelize = getSequelize();
sequelize
  .sync()
  .then(() => console.log("Tables synced successfully!"))
  .catch((error) => console.error("Error syncing tables: ", error));

// Routes
const apiRoutes = require("./src/Routes/routes.js");
app.use("/", apiRoutes);

// Global Error Handler
// app.use((err, req, res, next) => {
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//   });
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
