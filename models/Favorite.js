const mongoose = require("mongoose")

const favoriteSchema = new mongoose.Schema({

userId:String,

productId:String,

name:String,

price:Number,

image:String

})

module.exports = mongoose.model("Favorite",favoriteSchema)