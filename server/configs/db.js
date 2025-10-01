import mongoose from "mongoose";


const connectDB = async ()=>{
    console.log("Final Mongo URI:", `${process.env.MONGODB_URI}/car-rental`);
    try {
        // console.log("MONGODB_URI from env:", process.env.MONGODB_URI);
        
        mongoose.connection.on('connected', ()=> console.log("Database Connected"));
        await mongoose.connect(`${process.env.MONGODB_URI}/car-rental`);
        
    } catch (error) {
        console.log(error.message);
    }
}


export default connectDB;