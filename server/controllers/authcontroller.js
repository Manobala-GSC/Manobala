import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/usermodel.js';
import transporter from '../config/nodemailer.js';

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "Missing Details" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User Already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_secret, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
          });

        const mailOptions = {
            from: "kunalkhurana250@gmail.com",
            to: email,
            subject: "Welcome to the KunalStack",
            text: `Welcome to KunalStack website. Your account has been created with email id: ${email}`
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and Password are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid Password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_secret, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ success: true, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const sendOtp=async(req,res)=>{
    const {userId}=req.body;
    if(!userId){
        return res.json({success:false,message:"Details missing"});

    }
    try{
        const user=await User.findById(userId)
        const otp=String(Math.floor(100000+Math.random()*900000));
        if(user.isAccountVerified){
            return res.json({success:false,message:"Account Already Verified"});
        }
        user.verifyOtp=otp;
        user.verifyOtpExpireAt=Date.now()+24*60*60*1000;
        await user.save();
        const mailOption={
            from: "kunalkhurana250@gmail.com",
            to: user.email,
            subject: "Account Verification Otp",
            text: `Your otp is ${otp}.Verify your account using this.`

        }
        await transporter.sendMail(mailOption);
        return res.json({success:true,message:"Account Verfication Otp sent"});



    }
    catch(error){
        return res.json({success:false,message:error.message});
    }



}
export const verfiyEmail=async(req,res)=>{
    const{userId,otp}=req.body;
    if(!userId|| !otp){
        return res.json({success:false,message:"Details missing"});

    }
    try{
        const user=await User.findById(userId)
        
        if(!user){
            return res.json({success:false,message:"User not found"});
            
        }
        if(user.verifyOtp==''||user.verifyOtp!=otp){
            return res.json({success:false,message:"Invalid Otp"});

        }
        if(user.verifyOtpExpireAt<Date.now()){
            return res.json({success:false,message:"Invalid Otp"});

        }
        user.isAccountVerified=true;
        user.verifyOtp='';
        user.verifyOtpExpireAt=0;
        await user.save();
        return res.json({success:true,message:"Email Verified successfully"});


    }
    catch(error){

    }
}
export const isAuthenticated = async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ success: false, message: "Not authenticated" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }
        
        // Get user data and send it back
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }
        
        return res.json({ 
            success: true,
            userData: user 
        });
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }
}
export const sendresetotp=async(req,res)=>{
    const{email}=req.body;
    if(!email){
        return res.json({success:false,message:"Email Missing"});
    }
    try{
        const user=await User.findOne({email});
        if(!user){
            return res.json({success:false,message:"User Not found"});
        }
        const otp=String(Math.floor(100000+Math.random()*900000));
        user.resetOtp=otp;
        user.resetOtpExpireAt=Date.now()+15*60*1000;
        await user.save();
        const mailOption={
            from: "kunalkhurana250@gmail.com",
            to: user.email,
            subject: "Password Reset Otp",
            text: `Your otp for reseting the password is ${otp}.
            Use this otp for reseting the password.`

        }
        await transporter.sendMail(mailOption);
        return res.json({success:true,message:"Password reset Otp sent"});

    }
    catch(error){

    }
}

export const resetPassword=async(req,res)=>{
    const {email,otp,newPassword}=req.body;
    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "Missing details" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.resetOtp==''|| user.resetOtp !== otp || user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "Invalid or expired OTP" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        await user.save();

        return res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}
