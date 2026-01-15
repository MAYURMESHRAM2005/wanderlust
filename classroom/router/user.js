const express=require("express");
const router=express.Router();

//users
//index
router.get("/",(req,res)=>{
    res.send("Get for users");
});
//show
router.get("/:id",(req,res)=>{
    res.send("Get for users id");
});
//post
router.post("/",(req,res)=>{
    res.send("post for users");
});
//delete
router.delete("/:id",(req,res)=>{
    res.send("delete for users id");
});
module.exports=router;