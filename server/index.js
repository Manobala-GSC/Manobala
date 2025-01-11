import express from  'express'
import dotenv from "dotenv"
import cookieParser from 'cookie-parser' 
import cors from "cors"
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';

dotenv.config();
const app=express();
app.use(express.json());
app.use(cors({credentials:true}));
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send("Hello World");
})
connectDB();
const port=process.env.PORT|| 5000;

app.use('/api/user',authRouter)
app.listen(port,()=>{
    console.log(`App is listening ${port}`);
})





