const checkPrivilege = (requiredPrivilege) => {
  return (req, res, next) => {
    const { priviledges, role } = req.user;

    // Check if the user is a superadmin
    if (role === "superadmin") {
      return next(); // Allow superadmins to proceed without further checks
    }

    // Check if the user has the required privilege
    if (!priviledges.includes(requiredPrivilege)) {
      return res.status(403).json({ message: "Forbidden: You do not have the required privileges" });
    }

    next();
  };
};

export default checkPrivilege;
