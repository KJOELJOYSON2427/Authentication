const  Image=require("../models/images");
const{ uploadToCloudinary }=require("../helpers/cloudinary-helpers")
const fs=require("fs");
const cloudinary=require("../config/cloudinary");
const uploadImageController=async(req,res)=>{
    try{
        if(!req.file){
            return res.status(400).json({
                success:false,
                message:"File is required.please upload an image"
            })
        }

        const {url,publicId}=await uploadToCloudinary(req.file.path);

        //store
        const newlyUploadedImage=new Image({
            url,
            publicId,
            uploadedBy:req.userInfo.userId
        })
        await newlyUploadedImage.save();
        fs.unlinkSync(req.file.path)
        res.status(201).json({
            success:true,
            message:"Image uploaded successfully",
            image:newlyUploadedImage
        })
        
    }catch(e){
        console.error(e);
        res.status(500).json({
            success:false,
            message:"something went wrong! please try again"
        })
    }
}
const fetchImagesController = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    // Fix: Ensure countDocuments is called as a function
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    const sortObj = { [sortBy]: sortOrder };

    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

    if (images) {
        res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: totalPages,
            totalImages: totalImages,
            data: images
        });
    }
};


//delete
const deleteImageController=async(req,res)=>{
    try{
          const getCurrentIdofImageToBeDeleted=req.params.id;
          const userId=req.userInfo.userId;
          const image=await Image.findById(getCurrentIdofImageToBeDeleted);

          if(!image){
            return res.status(404).json({
                success:false,
                message:"Image not found"
            })
          }

          //check if this image is upladed by the current user who is trying to delete
          if(image.uploadedBy.toString()!==userId){
            return res.status(403).json({
                success:false,
                message:"You are not authorized to delete this message."
            })
          }
          //delete from cloudinary
          await cloudinary.uploader.destroy(image.publicId);
          await Image.findByIdAndUpdate(getCurrentIdofImageToBeDeleted);

          res.status(200).json({
            success:true,
            message:"Image deleted successfully"
          })
    }catch(e){
        console.error(e);
        res.status(500).json({
            success:false,
            message:"something went wrong! please try again"
        })
    }
}   
module.exports={
    uploadImageController,fetchImagesController,
    deleteImageController
};