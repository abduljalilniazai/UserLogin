require("dotenv").config();
const express=require('express');
const expressLayout=require("express-ejs-layouts");
const session=require("express-session");
const path=require("path")
const  flash=require("express-flash");
const connection=require("./model/db")
const MySQLStore=require("express-mysql-session")(session);
const userRoute=require("./routes/userRoute");
const adminRoute=require("./routes/adminRoute");
const passport=require("passport")
require("./config/passport")(passport)


const app=express();







//setting views
app.set("view engine","ejs");
app.use(expressLayout);
app.set("views", path.join(__dirname, "/views"));
app.use(express.static("public"))

//
app.use(express.urlencoded({extended:true}));

// Session store options (optional, defaults are usually fine)
const sessionStoreOptions = {
    clearExpired: true,
    checkExpirationInterval: 900000, // how frequently the store should remove expired sessions (in ms)
    expiration: 1000*50, // the maximum lifetime of a session (in ms)
    // You can also specify custom schema if needed
};

const sessionStore = new MySQLStore(sessionStoreOptions, connection);

app.use(session({
    key: 'session_cookie_name', // name of the session ID cookie
    secret: 'your_secret_key', // a secret string for signing session ID cookie
    store: sessionStore,
    resave: false, // forces the session to be saved back to the session store
    saveUninitialized: false, // forces an uninitialized session to be saved to the store
    cookie: {
        maxAge: 1000*50, // cookie expiration time (e.g., 24 hours)
        httpOnly: true, // prevents client-side JavaScript from reading the cookie
        secure: process.env.NODE_ENV === 'production' // ensure secure cookies in production with HTTPS
    }
}));

app.use(flash());

//Passport middleware
app.use(passport.session());
app.use(passport.initialize())

//welcome page
// app.get('/', (req, res) =>  {
//     res.render("welcome",{title:"Welcome Page"})
// });





app.use("/user", userRoute);
app.use("/",adminRoute)



const port=process.env.port;

app.listen(port, "localhost",()=>{
    console.log(`Server is listening on port ${port}`)
})