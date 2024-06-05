const roleMiddleware = (roles) => (req, res, next) => {
  const userRole = req.user.role;
  console.log(userRole);

  if (!roles.includes(userRole)) {
    return res.status(403).json({ error: `Unauthorized Access: Required roles are ${roles.join(', ')}` });
  }
  
  next();
};

export default roleMiddleware;