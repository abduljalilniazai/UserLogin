const express=require("express");
const router=express.Router();
const passport=require("passport")

const getUserController=require("../controllers/userController");



router.get("/login",getUserController().login);

router.get("/register", getUserController().register);
router.post("/register",getUserController().registerUser);
router.post("/login",(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:"/user/login",
        failureFlash:true
    })(req,res,next)
})



module.exports=router;