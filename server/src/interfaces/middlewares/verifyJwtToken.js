// const jwt = require("jsonwebtoken");

// const verifyJwtToken = (req, res, next) => {
//   const token = req.cookies.refreshToken;
//   if (!token && token == undefined)
//     return res
//       .status(401)
//       .json({ success: false, message: "Unauthorized - no token provided" });
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     if (!decoded)
//       return res
//         .status(401)
//         .json({ success: false, message: "Unauthorized - invalid token" });

//     req.userId = decoded.userId;
//     next();
//   } catch (error) {
//     console.log("Error in verifyToken ", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// module.exports = verifyJwtToken;

const jwt = require('jsonwebtoken');

const verifyJwtToken = async (req, res, next) => {
  const accessToken = req.headers['authorization']?.split(' ')[1]; 
  
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      req.userId = decoded.userId; 
      return next();
    } catch (error) {
      console.log('Access token error:', error);
    }
  }

  const refreshToken = req.cookies['refreshToken'];

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized - no refresh token provided'
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, {
    });

    res.setHeader('Authorization', `Bearer ${newAccessToken}`);

    req.userId = decoded.userId;
    next();

  } catch (error) {
    console.log('Error verifying refresh token:', error);
    return res.status(401).json({
      success: false,
      message: 'Unauthorized - invalid refresh token'
    });
  }
};

module.exports = verifyJwtToken;
