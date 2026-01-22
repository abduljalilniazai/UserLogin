const express=require("express");
const router=express.Router();
const passport=require("passport")

const getUserController=require("../controllers/userController");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");



router.get("/login",forwardAuthenticated, getUserController().login);

router.get("/register", forwardAuthenticated, getUserController().register);
router.post("/register",getUserController().registerUser);
router.post("/login",(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:"/user/login",
        failureFlash:true
    })(req,res,next)
})



module.exports=router;