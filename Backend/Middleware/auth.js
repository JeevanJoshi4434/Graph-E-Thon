const syncError = require("../Middleware/catchasyncErrors");
const ErrorHander = require("../utils/errorhander");
const jwt = require("jsonwebtoken");
const User = require("../Models/user");
const bcrypt = require('bcryptjs');

exports.isAuthenticatedUser = syncError( async(req,res,next)=>{
    const{ token }= req.cookies;
    if(!token){
        return next(new ErrorHander("please login to access this resource", 401))
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);

    next();
});


exports.fetchuser = syncError((req, res, next) => {
    // Get the user from the Jwt token and add id to req object
    const token = req.header("auth-token");
    if (!token) {
      res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {
      const data = jwt.verify(token, process.env.JWT_SECRET);
      req.user = data.user;
      next();
    } catch (error) {
      res.status(401).send({ error: "Please authenticate using a valid token" });
    }
  });
  


exports.isAuthenticated = syncError( async(req,res,next)=>{
    const {authtoken} = req.header("token");

    if(!authtoken){
        return next(new ErrorHander("please login to access this resource", 401))
    }
    const data = jwt.verify(authtoken, process.env.JWT_SECRET);
    req.user = await User.findById(data.id);

    next();
});


exports.authorizeRoles = (...roles) =>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next( new ErrorHander(
                `Role: ${req.user.role} is not allow to access this resource`, 403
                ));
        };

        next();
    };

}


exports.verifyHash = async (req, res, next) => {
  const text = process.env.COMPILER_SECRET;
  const incomingHash = process.env.COMPILER_HASH;
  if (!incomingHash) {
    return res.status(401).json({ message: 'Hash missing in the Environment.' });
  }
  if (!text){
    return res.status(500).json({ message: 'COMPILER_SECRET missing in the Environment.' });
  }
  try {
    // Compare the incoming hash with the calculated hash
    const isMatch = await bcrypt.compare(text, incomingHash);
    if (!isMatch) {
      return res.status(403).json({ message: 'Unauthorized Access.' });
    }

    // If the hash is valid, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 1, message: 'Internal Server Error!' });
  }
};
