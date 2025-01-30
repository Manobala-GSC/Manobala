import express from 'express'
import dotenv from "dotenv"
import cookieParser from 'cookie-parser' 
import cors from "cors"
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import chatRouter from './routes/chatRoutes.js';
import conversationRouter from './routes/conversationRoutes.js';
import blogRouter from './routes/blogRoutes.js';

dotenv.config();
const app = express();

// Increase payload limit for rich text content
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Updated CORS configuration
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send("Hello World");
})
connectDB();
const port=process.env.PORT|| 5000;

app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/conversations', conversationRouter)
app.listen(port,()=>{
    console.log(`App is listening ${port}`);
})

app.use('/api/blogs', blogRouter);





