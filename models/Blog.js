const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({

title:String,

author:String,

date:String,

image:String,

content:String

})

module.exports = mongoose.model("Blog",blogSchema)