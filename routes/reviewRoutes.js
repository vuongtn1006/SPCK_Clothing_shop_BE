const express = require("express")
const router = express.Router()
const Review = require("../models/Review")


router.get("/", async(req,res)=>{

const {productId} = req.query

try{

const reviews = await Review.find({productId})

res.json(reviews)

}catch(err){
res.status(500).json(err)
}

})


router.post("/", async(req,res)=>{

try{

const review = new Review(req.body)

await review.save()

res.json(review)

}catch(err){
res.status(500).json(err)
}

})

module.exports = router