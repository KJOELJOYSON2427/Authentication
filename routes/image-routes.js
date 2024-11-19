const express=require("express");
const authMiddleware=require("../middleware/auth-middleware");
const adminMiddleware=require("../middleware/admin-middleware");
const uploadMiddleware=require("../middleware/upload-middleware");
const {uploadImageController,fetchImagesController,deleteImageController}=require("../controllers/image-controllers")
const router=express.Router();

router.post("/upload",
    authMiddleware,
    adminMiddleware,
    uploadMiddleware.single('image'),
    uploadImageController
);
router.delete("/:id",authMiddleware,adminMiddleware,deleteImageController);

router.get("/get", authMiddleware,fetchImagesController)

module.exports=router;
