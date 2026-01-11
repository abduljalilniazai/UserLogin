function initRoute(){
    return{
        login(req,res){
            res.render("login",{title:"Our Login Page!"})
        },
        register(req,res){
            res.render("register",{title:"Register User Page!"})
        },

        registerUser(req,res){
            const {name, email, password, password2}=req.body;
            console.log(name, email)
        }
    }
}

module.exports=initRoute;