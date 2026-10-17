const express = require("express")
const router = express.Router()
const Voucher = require("../models/Voucher")


router.get("/", async(req,res)=>{
try{

const vouchers = await Voucher.find()

res.json(vouchers)

}catch(err){
res.status(500).json(err)
}
})


router.post("/", async(req,res)=>{
try{

const voucher = new Voucher(req.body)

const savedVoucher = await voucher.save()

res.json(savedVoucher)

}catch(err){
console.error("CREATE VOUCHER ERROR:",err)
res.status(500).json(err)
}
})


router.put("/:id", async(req,res)=>{
try{

const updatedVoucher = await Voucher.findByIdAndUpdate(
req.params.id,
req.body,
{ new:true }
)

if(!updatedVoucher){
return res.status(404).json({message:"Không tìm thấy voucher"})
}

res.json(updatedVoucher)

}catch(err){
console.error("UPDATE VOUCHER ERROR:",err)
res.status(500).json(err)
}
})


router.delete("/:id", async(req,res)=>{
try{

const deletedVoucher = await Voucher.findByIdAndDelete(req.params.id)

if(!deletedVoucher){
return res.status(404).json({message:"Không tìm thấy voucher"})
}

res.json({message:"Đã xoá voucher"})

}catch(err){
console.error("DELETE VOUCHER ERROR:",err)
res.status(500).json(err)
}
})

module.exports = router