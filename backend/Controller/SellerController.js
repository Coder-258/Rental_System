const BlacklistToken = require('../Schemas/BlacklistToken');
const SellerModel=require('../Schemas/SellerSchema');
const {validationResult}=require('express-validator');

// the below function checks if there is any error in the ccredentials of the req.



 module.exports.SignUp= async (req,res)=>{
    // firstly this function checks if there is any error or not
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        console.error("Validation error",errors.array());
        return res.status(400).json({errors:errors.array()});
    }
    const {firstName,lastName,email,password,phoneNumber,bankAccount}=req.body;
    const userAlreadyExist=await SellerModel.findOne({$or:[{email,phoneNumber}]});
    if(userAlreadyExist){
        return res.status(400).json({message:"An account already exists with this email or phone number"})
    }
    const bankAccountExists=await SellerModel.findOne({bankAccount});
    if(bankAccountExists){
        return res.status(400).json({message:"Please enter correct bank account number"})
    }
    // after verifying no error . a user is created and saved in the database along with the hashed password
    const hashedPassword=await SellerModel.hashPassword(password);
       const seller = await SellerModel.create({
            fullName:{
                firstName,
                lastName
            },
            email:email,
            password:hashedPassword,
            phoneNumber:phoneNumber,
            bankAccount:bankAccount
       })
       await seller.save();
       const token=await seller.generateAuthToken();
       console.log(seller);
      return res.status(201).json({token,seller})
 }


 module.exports.LoginSeller=async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        console.error("Validation error",errors.array());
        return res.status(400).json({errors:errors.array()});
    }
    const {email,password}=req.body;
    const seller=await SellerModel.findOne({email}).select("+password");
    if(!seller){
       return res.status(401).json({message:"Invalid username or password"});
    }
    const matchPassword=await seller.comparePassword(password);
    if(!matchPassword){
       return res.status(401).json({message:"Invalid username or password"});
    }
    const token = await seller.generateAuthToken();
    if(!token){
        return res.status(401).json({message:"token generation failed"});
    }

    res.cookie("token", token, {
        httpOnly: true, // Prevents JavaScript access
        secure: true, // Ensures HTTPS usage
        sameSite: "Strict", // Prevents CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week expiration
      });
    console.log(token,seller)
    return res.status(201).json({token,seller});
 }
 module.exports.GetProfile=async (req,res)=>{
        const seller= await SellerModel.findById(req.seller._id);
        console.log('seller:',seller)
        return res.status(200).json(seller); 
 }
 module.exports.LogoutSeller = async (req, res) => {
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