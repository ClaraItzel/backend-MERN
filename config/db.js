import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config();

const conectarDB= async()=>{
    try {
        const db= await mongoose.connect(process.env.MONGO_URI)
        //console.log(process.env.MONGO_URI);
       
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default conectarDB;