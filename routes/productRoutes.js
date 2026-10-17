const express = require("express")
const router = express.Router()
const Product = require("../models/Product")


router.get("/", async(req,res)=>{
try{
const products = await Product.find()
res.json(products)
}catch(err){
res.status(500).json(err)
}
})


router.get("/:id", async(req,res)=>{
try{
const product = await Product.findById(req.params.id)
res.json(product)
}catch(err){
res.status(500).json(err)
}
})


router.post("/", async(req,res)=>{
try{
const product = new Product(req.body)

const savedProduct = await product.save()

res.json(savedProduct)

}catch(err){
console.error("CREATE PRODUCT ERROR:",err)
res.status(500).json(err)
}
})


router.put("/:id", async(req,res)=>{
try{

const updatedProduct = await Product.findByIdAndUpdate(
req.params.id,
req.body,
{ new:true }
)

if(!updatedProduct){
return res.status(404).json({message:"Không tìm thấy sản phẩm"})
}

res.json(updatedProduct)

}catch(err){
console.error("UPDATE PRODUCT ERROR:",err)
res.status(500).json(err)
}
})


router.delete("/:id", async(req,res)=>{
try{

const deletedProduct = await Product.findByIdAndDelete(req.params.id)

if(!deletedProduct){
return res.status(404).json({message:"Không tìm thấy sản phẩm"})
}

res.json({message:"Đã xoá sản phẩm"})

}catch(err){
console.error("DELETE PRODUCT ERROR:",err)
res.status(500).json(err)
}
})

module.exports = router