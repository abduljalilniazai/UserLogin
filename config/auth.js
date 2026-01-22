module.exports={
    ensureAuthenticated:function(req,res,next){
        if(req.isAuthenticated()){
            return next()
        }
        req.flash("error","Please login to view this resources")
        res.redirect("/user/login")
    },
    forwardAuthenticated:function(req,res,next){
        if(!req.isAuthenticated()){
            res.locals.layout = false;
            return next();
        }
        res.redirect("/dashboard")
    }
}