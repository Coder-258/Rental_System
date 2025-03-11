// this  is used to add the tokens when the user tries to logout and then delete it after 24 hrs so the unathorized user cannot access it.
const mongoose=require('mongoose');
const blacklistTokenSchema=new mongoose.Schema({
    token:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:86400 // 24 hours in seconds
    }
})
module.exports=mongoose.model('blacklistToken',blacklistTokenSchema);