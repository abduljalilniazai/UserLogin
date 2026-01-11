const express=require("express");
const router=express.Router();

const getUserController=require("../controllers/userController");


router.get("/login",getUserController().login);

router.get("/register", getUserController().register);
router.post("/register",getUserController().registerUser);



module.exports=router;