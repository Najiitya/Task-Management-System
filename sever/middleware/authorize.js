const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req, res, next) {
    try{
        const authHeader = req.header("Authorization");

    if (!authHeader){
        return res.status(403).json({error : "Access denied No token was found."});
    }

    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user_id = payload.user_id;

    next();

    }catch(err){
        console.error(err.message);

        return res.status(403).json({eroor : "Access denied. Invalid or Expired Token"});
    }
}