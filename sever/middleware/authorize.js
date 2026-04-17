const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async (req, res, next) => {
  try {
    // 1. Get the token from the request header
    // (Tokens are usually sent in a header called "Authorization")
    const authHeader = req.header("Authorization");
    
    if (!authHeader) {
      return res.status(403).json({ error: "Access Denied. No token provided." });
    }

    // 2. The header usually looks like "Bearer eyJhbGciOi..." so we split it to get just the token
    const token = authHeader.split(" ")[1];

    // 3. Verify the token using your secret key
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach the user's ID to the request so the next route knows exactly who is making the request
    req.user_id = payload.user_id;
    
    // 5. Tell Express to move on to the actual route
    next();
  } catch (err) {
    console.error(err.message);
    return res.status(403).json({ error: "Access Denied. Invalid or expired token." });
  }
};