const express = require("express")
const router = express.Router()
const Blog = require("../models/Blog")

router.get("/", async(req,res)=>{
try{
const blogs = await Blog.find()
res.json(blogs)
}catch(err){
res.status(500).json(err)
}
})

router.get("/:id", async(req,res)=>{
try{
const blog = await Blog.findById(req.params.id)
res.json(blog)
}catch(err){
res.status(500).json(err)
}
})

module.exports = router