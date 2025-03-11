const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const sellerSchema=new mongoose.Schema({
    fullName:{
        firstName:{
            type:String,
            required:true,
            minlength:[3,"First name should be minimum 3 characters long"]
        },
        lastName:{
            type:String,
            minlength:[3,"Last name should be minimum 3 characters long"]
        }
    },
        email:{
            type:String,
            required:true,
            unique:true,
            minlength:[5,"email should be minimum 5 characters long"]
        },
        password:{
            type:String,
            required:true,
            select:false
        },
        socketId:{
            type:String
        },
        phoneNumber:{
            type:String,
            required:true,
            minlength:[10,"Phone Number should be of 10 characters"],
            maxlength:[10,"Phone Number should be of 10 characters"],
        },
        bankAccount:{
            type:String,
            required:true,
            minlength:[16,"Bank Account Number should be of 16 characters"],
            maxlength:[16,"Bank Account Number should be of 16 characters"],
        }
});
sellerSchema.methods.generateAuthToken=async function(){
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET_SELLER, { expiresIn: '24h' });
    return token;
}
sellerSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
}
sellerSchema.statics.hashPassword=async function(password){
    return await bcrypt.hash(password,10)
}
const SellerModel=mongoose.model('seller',sellerSchema);
module.exports=SellerModel;