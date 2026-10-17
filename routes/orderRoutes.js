const express = require("express");
const router = express.Router();
const Order = require("../models/Order");


router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    let orders;

    if (userId) {
      orders = await Order.find({ userId: String(userId) });
    } else {
      orders = await Order.find();
    }

    res.json(orders);
  } catch (err) {
    console.error("GET ORDERS ERROR:", err);
    res.status(500).json(err);
  }
});


router.post("/", async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      userId: String(req.body.userId)
    });

    const savedOrder = await order.save();

    res.json(savedOrder);
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json(err);
  }
});


router.put("/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        deliveryStatus: req.body.deliveryStatus
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng"
      });
    }

    res.json(updatedOrder);

  } catch (err) {
    console.error("UPDATE ORDER ERROR:", err);
    res.status(500).json(err);
  }
});

module.exports = router;