const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const verifyJwtToken = (req, res, next) => {
  const accessToken = req.headers['authorization']?.split(' ')[1];

  if (!accessToken) {
    return res.status(401).send('Access Denied. No access token provided.');
  }

  try {
    const decoded = jwt.verify(accessToken, secretKey);

    req.userId = decoded.userId;
    req.email = decoded.email;
    next();
  } catch (error) {
    return res.status(401).send('Invalid or expired access token.');
  }
};

module.exports = verifyJwtToken;
