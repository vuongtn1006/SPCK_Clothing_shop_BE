const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({

name:String,

description:String,

price:Number,

images:[String],

category:String,

gender:String,

sizes:[mongoose.Schema.Types.Mixed],

stock:Number,

createdAt:{
type:Date,
default:Date.now
}

})

module.exports = mongoose.model("Product",productSchema)