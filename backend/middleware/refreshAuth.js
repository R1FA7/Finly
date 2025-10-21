import jwt from 'jsonwebtoken';

const refreshAuth = (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    
    if (!refreshToken) {
      return res.status(401).json({ 
        success: false, 
        message: "No refresh token provided" 
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    if (!decoded.id) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token payload" 
      });
    }

    req.user = { id: decoded.id, role: decoded.role };
    next();

  } catch (error) {
    console.error('Refresh token verification failed:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: "Refresh token expired" 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid refresh token" 
      });
    }

    return res.status(401).json({ 
      success: false, 
      message: "Token verification failed" 
    });
  }
};

export default refreshAuth;