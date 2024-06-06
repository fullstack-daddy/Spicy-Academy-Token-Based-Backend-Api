const roleMiddleware = (roles) => async (req, res, next) => {
  try {
    const userRole = req.user.role;
    // console.log("User Role:", userRole);
    // console.log("Request User:", req.user); // Log the entire req.user object

    if (!userRole) {
      console.error("User role not found in request");
      return res.status(403).json({
        error: "Unauthorized Access: User role not found",
      });
    }

    // Assuming the user information is retrieved from the database and stored in req.user
    const user = req.user; // Adjust this line according to your implementation

    if (!user || !user.role) {
      console.error("User not found or missing role");
      return res.status(403).json({
        error: "Unauthorized Access: User not found or missing role",
      });
    }

    if (!roles.includes(user.role)) {
      console.error(`Unauthorized Access: User role ${user.role} does not have access`);
      return res.status(403).json({
        error: `Unauthorized Access: User role ${user.role} does not have access`,
      });
    }

    next();
  } catch (error) {
    console.error("Error in role middleware:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export default roleMiddleware;
