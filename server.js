const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()


const userRoutes = require("./routes/userRoutes")
const productRoutes = require("./routes/productRoutes")
const reviewRoutes = require("./routes/reviewRoutes")
const orderRoutes = require("./routes/orderRoutes")
const favoriteRoutes = require("./routes/favoriteRoutes")
const blogRoutes = require("./routes/blogRoutes")
const voucherRoutes = require("./routes/voucherRoutes")

const app = express()


app.use(cors())
app.use(express.json())


mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB connected"))
.catch(err => console.log(err))



app.use("/api", userRoutes) 
// login, register

app.use("/api/products", productRoutes)

app.use("/api/reviews", reviewRoutes)

app.use("/api/orders", orderRoutes)

app.use("/api/favorites", favoriteRoutes)

app.use("/api/blogs", blogRoutes)

app.use("/api/vouchers", voucherRoutes)



app.get("/",(req,res)=>{
res.send("API running")
})


app.listen(process.env.PORT,()=>{
console.log("Server running on port "+process.env.PORT)
})