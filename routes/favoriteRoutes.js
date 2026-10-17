const express = require("express")
const router = express.Router()
const Favorite = require("../models/Favorite")

router.get("/", async(req,res)=>{

const {userId} = req.query

try{

const favorites = await Favorite.find({userId})

res.json(favorites)

}catch(err){
res.status(500).json(err)
}

})

router.post("/", async(req,res)=>{

try{

const fav = new Favorite(req.body)

await fav.save()

res.json(fav)

}catch(err){
res.status(500).json(err)
}

})

router.delete("/:id", async(req,res)=>{

try{

await Favorite.findByIdAndDelete(req.params.id)

res.json({message:"Deleted"})

}catch(err){
res.status(500).json(err)
}

})

module.exports = router