const jwt = require("jsonwebtoken");

const verifyJwtToken = (req, res, next) => {
  const token = req.cookies.access_token;
  console.log("this is tokern from middleware", token);
  if (!token && token == undefined)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - no token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - invalid token" });

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log("Error in verifyToken ", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = verifyJwtToken;
