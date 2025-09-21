const refreshAuth = (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(401).json({ success: false, message: "No refresh token" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid refresh token" });
  }
};
export default refreshAuth;