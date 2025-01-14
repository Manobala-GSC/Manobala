import express from 'express'
import { isAuthenticated, login, logout, register, resetPassword, sendOtp, sendresetotp, verfiyEmail } from '../controllers/authcontroller.js';
import userAuth from '../middleware/userAuth.js';
const authRouter=express.Router();
authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/sendOtp',userAuth,sendOtp);
authRouter.post('/verifyEmail',userAuth,verfiyEmail);
authRouter.get('/is-auth',userAuth,isAuthenticated);
authRouter.post('/sendresetotp',sendresetotp);
authRouter.post('/resetPassword',resetPassword);




export default authRouter;