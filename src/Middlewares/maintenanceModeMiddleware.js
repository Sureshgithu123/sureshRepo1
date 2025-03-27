// utils/maintenanceModeMiddleware.js

// Middleware to handle maintenance mode
const checkMaintenanceMode = (req, res, next) => {
    const maintenanceMode = process.env.MAINTENANCE_MODE === 'true'; // Check if maintenance mode is enabled
  
    if (maintenanceMode) {
      return res.status(503).json({
        success: false,
        message: 'The service is currently down for maintenance. Please try again later.',
      });
    }
  
    next(); // Proceed to the next middleware or route handler
  };
  
  module.exports = checkMaintenanceMode;
  