const mongoose = require("mongoose")
const data = require("./db.json")

const User = require("./models/User")
const Product = require("./models/Product")
const Review = require("./models/Review")
const Order = require("./models/Order")
const Favorite = require("./models/Favorite")
const Blog = require("./models/Blog")
const Voucher = require("./models/Voucher")

mongoose.connect("mongodb+srv://vuong:vuong1006@learn.uq3br8m.mongodb.net/clothing-shop")

async function importData(){

await User.insertMany(data.users)
await Product.insertMany(data.products)
await Review.insertMany(data.reviews)
await Order.insertMany(data.orders)
await Favorite.insertMany(data.favorites)
await Blog.insertMany(data.blogs)
await Voucher.insertMany(data.vouchers)

console.log("Data imported successfully")

process.exit()

}

importData()