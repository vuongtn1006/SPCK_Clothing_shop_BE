const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({

userId:String,

userName:String,

address:String,

phone:String,

coords:[Number],

items:Array,

total:Number,

voucher:String,

status:String,

deliveryStatus:String,

createdAt:Date

})

module.exports = mongoose.model("Order",orderSchema)