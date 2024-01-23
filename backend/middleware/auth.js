const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
     const authHeader = req.headers.authorization;

     if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(403).json({
               message: "Authentication failed"
          })
     }

     const token = authHeader.split(' ')[1];


     try {
          const decoded = jwt.verify(token, process.env.SECRET_KEY);

          req.user = decoded;

          next();
     } catch (err) {
          return res.status(403).json({});
     }
}


module.exports = authMiddleware