import express from  'express'
import dotenv from "dotenv"
import cookieParser from 'cookie-parser' 
import cors from "cors"

dotenv.config();
const app=express();
app.use(express.json());
app.use(cors({credentials:true}));
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send("Hello World");
})
const port=process.env.PORT|| 5000;
app.listen(port,()=>{
    console.log(`App is listening ${port}`);
})





