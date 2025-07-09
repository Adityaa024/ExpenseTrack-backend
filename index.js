import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db/db.js';
import userRoute from './routes/user.routes.js';
import expenseRoute from './routes/expense.router.js';

dotenv.config({});



const app=express();

const PORT =8000;

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}))
const corsOptions={
    origin:"http://localhost:5173",
    credentials:true,
}
app.use(cors(corsOptions));

//apis
app.use(cookieParser()); 
app.use('/api/v1/user',userRoute);
app.use('/api/v1/expense',expenseRoute);




app.listen(PORT,()=>{
    connectDB();
    console.log(`Server listen at port ${PORT}`)
})