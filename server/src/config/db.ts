import mongoose from 'mongoose';
import { mongoDbUrl } from '../secret';


export const connectDB = async (options={}) =>{
    try{
await mongoose.connect(mongoDbUrl,options)
console.log('Connection established in DB');
mongoose.connection.on('error', (err) =>{
    console.error("DB connection error",err);
})
    }
    catch(err:any){
        console.log('could not connect to Mongo',err.toString());

    }
}
