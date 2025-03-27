// const allowedIPs = ["127.0.0.1", "192.168.1.100"]; // Add your allowed IPs here

const allowedIPs = process.env.SWAGGER_WHITELIST;

const ipWhitelistMiddleware = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;

  // Check if the IP is allowed
  if (allowedIPs.includes(clientIP)) {
    return next();
  }
  
  res.status(403).json({ message: "Access denied" });
};

module.exports = ipWhitelistMiddleware;
