import mongoose from 'mongoose'
const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    verifyOtp:{type:String,Default:''},
    verifyOtpExpireAt:{type:Number,Default:0},
    isAccountVerified:{type:Boolean,Default:false},
    resetOtp:{type:String,Default:''},
    resetOtpExpireAt:{type:Number,Default:0},

})
const User=mongoose.models.User||mongoose.model("User",userSchema);
export default User;
