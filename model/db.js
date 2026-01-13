const mysql=require("mysql2/promise");

const conn=mysql.createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"users"
})

conn.getConnection(function(err){
    if(err){
        console.log(err)
    }else{
        console.log("Connected to database")
    }
})

module.exports=conn;