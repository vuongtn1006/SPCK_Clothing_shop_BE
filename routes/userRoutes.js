const express = require("express")
const router = express.Router()
const User = require("../models/User")


router.get("/", async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})


router.post("/login", async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email, password })

    if (!user) {
      return res.status(401).json({
        message: "Email hoặc mật khẩu không đúng"
      })
    }

    if (user.isActive === false) {
      return res.status(403).json({
        message: "Tài khoản đã bị khóa"
      })
    }

    res.json(user)

  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})


router.post("/register", async (req, res) => {
  const { name, email, password } = req.body

  try {
    const existUser = await User.findOne({ email })

    if (existUser) {
      return res.status(400).json({
        message: "Email đã tồn tại"
      })
    }

    const newUser = new User({
      name,
      email,
      password,
      role: "user",

     
      isActive: true
    })

    await newUser.save()

    res.json(newUser)

  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})


router.put("/:id/status", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive },
      { new: true }
    )

    res.json(updatedUser)

  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})


router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)

    res.json({ message: "Xóa user thành công" })

  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router