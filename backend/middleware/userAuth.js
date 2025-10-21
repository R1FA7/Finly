import jwt from "jsonwebtoken";
import { getPermissionsForRole } from "../lib/permissions.js";

// const userAuth = (req, res, next) => {
const userAuth = (requiredPermission) => {
  return (req,res,next)=> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer "))
        return res.status(401).json({ success: false, message: "No token found" });

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id, role: decoded.role };

      const userPermissions = getPermissionsForRole(req.user.role) || [];

      console.log("Decoded:", decoded); // See what's in token
      console.log("User role:", req.user.role); // See if role is here
      console.log("Required permission to access this page:", requiredPermission);
      console.log("User permissions:", userPermissions);
      
      if(requiredPermission && !userPermissions.includes(requiredPermission)){
        return res.status(403).json({
          success: false,
          message:"Access denied."
        })
      }
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
  }
};

export default userAuth;
