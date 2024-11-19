const cloudinary= require("cloudinary").v2;

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME || "dtqzaouaj",
    api_key:process.env.CLOUDINARY_API_KEY || "668845894346329",
    api_secret:process.env.CLOUDINARY_API_SECRET||"HC0nfZLaptwo1t1Pq91XwOQyWuE"
})

module.exports=cloudinary;