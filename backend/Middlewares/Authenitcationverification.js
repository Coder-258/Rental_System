const UserModel=require('../Schemas/UserSchema');
const SellerModel=require('../Schemas/SellerSchema');
const jwt=require('jsonwebtoken');
const BlacklistToken=require('../Schemas/BlacklistToken');
const mongoose=require('mongoose');
module.exports.authUser = async (req, res, next) => {
  try {
      const token = req.headers.authorization;
      console.log(token)
      if (!token) {
          return res.status(401).json({ message: "Authorization header missing" });
      }

      // const token = authHeader.split(' ')[1];
      // if (!token) {
      //     return res.status(401).json({ message: "Token not found in Authorization header" });
      // }

      console.log("Token received:", token);

      const blacklistedToken = await BlacklistToken.findOne({ token });
      if (blacklistedToken) {
          return res.status(401).json({ message: "Token has been blacklisted" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);

      const user = await UserModel.findById(decoded._id);
      if (!user) {
          return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      return next();
  } catch (error) {
      console.error("Authentication error:", error);
      if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({ message: "Invalid token" });
      }
      return res.status(500).json({ message: "An error occurred during authentication" });
  }
};
module.exports.authSeller = async (req, res, next) => {
    try {
        const sellertoken = req.headers.authorization;  // Extract the token correctly
        if (!sellertoken) {
            return res.status(401).json({ message: "Authorization header missing" });
        }
  
        console.log("Token received:", sellertoken);
  
        const blacklistedToken = await BlacklistToken.findOne({ sellertoken });
        if (blacklistedToken) {
            return res.status(401).json({ message: "Token has been blacklisted" });
        }
  
        // Ensure you're using the correct secret for the seller token
        const decoded = jwt.verify(sellertoken, process.env.JWT_SECRET_SELLER);
        console.log("Decoded token", decoded);
  
        const seller = await SellerModel.findById(decoded._id);
        if (!seller) {
            return res.status(401).json({ message: "Seller not found" });
        }
  
        req.seller = seller;
        return next();
    } catch (error) {
        console.error("Authentication error:", error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token or signature" });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        return res.status(500).json({ message: "An error occurred during authentication" });
    }
  };
  
  