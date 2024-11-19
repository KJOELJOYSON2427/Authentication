const express= require("express");
const router=express.Router();
const {registerUser,Loginuser, changePassword}=require("../controllers/auth-controllers");
const authMiddleware=require("../middleware/auth-middleware")

router.post("/register",registerUser);
router.post("/login",Loginuser);
router.post("/change-password",authMiddleware,changePassword);

module.exports=router;