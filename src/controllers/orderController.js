const userOrder = require("../models/orders");
const { sendMsgToEmail } = require("../helpers/sendMsgToEmail");
const createOrder = async (req, res) => {
  try {
    const doc = new userOrder({
      name: req.body.name,
      email: req.body.email,
      phoneNum: req.body.phoneNum,
      totalPrice: req.body.totalPrice,
      city: req.body.city,
      promo: req.body.promo,
      userCart: req.body.userCart,
    });

    const postOrder = await doc.save();
    console.log(req.body.email, "req.body.email");
    await sendMsgToEmail(
      req.body.email,
      req.body.totalPrice,
      req.body.userCart
    );
    res.json({
      ...postOrder._doc,
      success: true,
      message: "Заказ успешно оформлен",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось оформить заказ",
      success: false,
    });
  }
};
module.exports = {
  createOrder,
};
