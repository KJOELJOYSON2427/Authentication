require("dotenv").config();
const mongoose=require("mongoose");
const connectToDB=async()=>{
    try{
       await mongoose.connect("mongodb+srv://joeljoyson2427:joel.2427@cluster0.ln30k.mongodb.net/" );
       console.log("MangoDB connected successfully")
    }catch(e){
        console.log("MangoDB connection failed");
        process.exit(1);
    }
}
module.exports=connectToDB;