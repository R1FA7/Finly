import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: "Not Authorized(NO TOKEN)" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (decoded.id) {
      req.user = { id: decoded.id };
    } else {
      return res.status(403).json({ success: false, message: "Not authorized.Try again" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};
export default userAuth;
