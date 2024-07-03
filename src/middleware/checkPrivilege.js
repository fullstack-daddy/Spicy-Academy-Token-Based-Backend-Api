const checkPrivilege = (requiredPrivilege) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    const { priviledges, role } = req.user;

    if (role === "superadmin") {
      return next(); // Allow superadmins to proceed without further checks
    }

    if (!Array.isArray(priviledges)) {
      return res.status(500).json({ message: "Internal server error: Invalid user privileges" });
    }

    if (!priviledges.includes(requiredPrivilege)) {
      return res.status(403).json({ message: "Forbidden: You do not have the required privileges" });
    }

    next();
  };
};
export default checkPrivilege;
