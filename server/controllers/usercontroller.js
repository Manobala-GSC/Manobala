import User from "../models/usermodel.js";
export const getUserData=async(req,res)=>{
    try{
        const {userId}=req.body;
        const user=await User.findById(userId);
        if(!user){
            res.json({success:false,message:"user Not found"});
        }
        console.log(user.isAccountVerified);
        res.json({
            success:true,
            userData:{
                name:user.name,
                email:user.email,
                isAccountVerified:user.isAccountVerified

            }
            
        })

    }
    catch(error){

    }

}