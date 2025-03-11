const express=require('express');
const router=express.Router();
const {body}=require('express-validator')
const UserController=require('../Controller/UserController')
const Authentication=require("../Middlewares/Authenitcationverification");
// post request to signup the user which is then passed to the signup method of usercontroller to check if the credentials in the req is valid or not and if valid then create a new user 
router.post("/signUp",[
    body('firstName').isLength({min:3}).withMessage("First Name should be minimum 3 characters long "),
    body('email').isEmail().withMessage("Invalid Email"),
    body('password').isLength({min:8}).withMessage("Password Must be atleast 8 characters long"),
],
    UserController.SignUp
)

// router for the user login
router.post("/login",[
body('email').isEmail().withMessage("Invalid Email"),
body('password').isLength({min:8}).withMessage("Password Must be atleast 8 characters long"),],
UserController.LoginUser
)

router.get("/getProfile",Authentication.authUser,UserController.GetProfile);
router.get("/logout",Authentication.authUser,UserController.LogoutUser);
module.exports=router;