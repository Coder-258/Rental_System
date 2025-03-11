const BlacklistToken = require('../Schemas/BlacklistToken');
const UserModel= require('../Schemas/UserSchema');
const {validationResult}=require('express-validator');

// the below function checks if there is any error in the ccredentials of the req.



 module.exports.SignUp= async (req,res)=>{
    // firstly this function checks if there is any error or not
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        console.error("Validation error",errors.array());
        return res.status(400).json({errors:errors.array()});
    }
    const {firstName,lastName,email,password}=req.body;
    const userAlreadyExist=await UserModel.findOne({email});
    if(userAlreadyExist){
        return res.status(400).json({message:"User already exists"})
    }
    // after verifying no error . a user is created and saved in the database along with the hashed password
    const hashedPassword=await UserModel.hashPassword(password);
       const user = await UserModel.create({
            fullName:{
                firstName,
                lastName
            },
            email:email,
            password:hashedPassword
       })
       await user.save();
       const token=await user.generateAuthToken();
       console.log(user);
      return res.status(201).json({token,user})
 }


 module.exports.LoginUser=async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        console.error("Validation error",errors.array());
        return res.status(400).json({errors:errors.array()});
    }
    const {email,password}=req.body;
    const user=await UserModel.findOne({email}).select("+password");
    if(!user){
       return res.status(401).json({message:"Invalid username or password"});
    }
    const matchPassword=await user.comparePassword(password);
    if(!matchPassword){
       return res.status(401).json({message:"Invalid username or password"});
    }
    const token = await user.generateAuthToken();
    if(!token){
        return res.status(401).json({message:"token generation failed"});
    }

    res.cookie("token", token, {
        httpOnly: true, // Prevents JavaScript access
        secure: true, // Ensures HTTPS usage
        sameSite: "Strict", // Prevents CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week expiration
      });
    console.log(token,user)
    return res.status(201).json({token,user});
 }
 module.exports.GetProfile=async (req,res)=>{
        const user= await UserModel.findById(req.user._id);
        return res.status(200).json(user); 
 }
 module.exports.LogoutUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader;
        console.log("Token to blacklist:", token);
        await BlacklistToken.create({ token });
        res.clearCookie('token'); // If you're using cookies
        return res.status(200).json({ message: "Logged Out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "An error occurred during logout" });
    }
};