const LocalStrategy=require("passport-local").Strategy;
const bcrypt=require("bcryptjs");
const conn=require("../model/db");



module.exports=function(passport){
    const authenticateUser= async(email, password, done)=>{
        try{
            query="select * from userregister where email = ?";
        const [result]=await conn.query(query, [email]);

        if(result.length===0){
            return done(null, false, {message: "No user with that username"})
        }

        const user=result[0];

        const isMatch=await bcrypt.compare(password, user.password)
        if(!isMatch){
            return done(null, false, {message:"Password incorrect"})
        }

        return done(null, user);
        }catch(err){
            return done(err)
        }
    }

    passport.use(
        new LocalStrategy(
            {usernameField:"email"}, authenticateUser
        )
    );
    passport.serializeUser((user, done)=>{
        done(null, user.email)
    })
    passport.deserializeUser(async (email, done)=>{
        try{
            const[result]= await conn.query(
                "select * from userregister where email = ?", [email]
            );
            done(null, result[0]);
        }catch(err){
            done(err)
        }
    })
};


