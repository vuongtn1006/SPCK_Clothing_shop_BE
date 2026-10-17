const mongoose = require("mongoose")

const voucherSchema = new mongoose.Schema({

code:String,

title:String,

description:String,

discountType:String,

discountValue:Number,

minOrderValue:Number,

expiryDate:String,

image:String

})

module.exports = mongoose.model("Voucher",voucherSchema)