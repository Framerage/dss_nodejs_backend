const orderModal = require("../models/orders");
const { sendMsgToEmail } = require("../helpers/sendMsgToEmail");
const createOrder = async (req, res) => {
  try {
    const doc = new orderModal({
      name: req.body.name,
      email: req.body.email,
      phoneNum: req.body.phoneNum,
      totalPrice: req.body.totalPrice,
      city: req.body.city,
      promo: req.body.promo,
      userCart: req.body.userCart,
      orderType: req.body.orderType,
      specImgsOrder: req.body.specImgsOrder,
    });
    // await doc.insert({ orderNum: "productid", sequence_value: 0 });
    // await doc.save();
    // await orderModal.findOneAndUpdate(
    //   // { _id: newOrder._id },
    //   // { _id: req.params.id },
    //   { id: "autoval" },

    //   { $inc: { orderNum: 1 } },
    //   { new: true }
    //   // (err, res) => {
    //   //   console.log(res, "error res");
    //   //   console.log(err, "error update");
    //   // }
    // );
    const postOrder = await doc.save();
    await sendMsgToEmail(
      req.body.email,
      req.body.totalPrice,
      req.body.userCart,
      req.body.phoneNum,
      "create"
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
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModal.find().exec();
    res.json({ orders: orders, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить заказы",
      success: false,
    });
  }
};
const getUserOrders = async (req, res) => {
  try {
    const orders = await orderModal.find().exec();
    const userOrders = orders.filter((order) => order.email === req.body.email);
    res.json({ orders: userOrders, success: true });
  } catch (err) {
    console.log(err, "error orders");
    res.status(500).json({
      message: "Не удалось получить личные заказы",
      success: false,
    });
  }
};
const getOrder = async (req, res) => {
  const orderId = req.params.id;
  try {
    const order = await orderModal
      .findByIdAndUpdate(
        {
          _id: orderId,
        },
        { new: true }
      )
      .populate("user")
      .exec();
    if (!order) {
      return res.status(404).json({
        error: "Not found",
        message: "Заказ не найдена",
      });
    }
    res.json(order);
  } catch (err) {
    console.log(err, "error result");
    res.status(500).json({
      error: "Problems with server",
      message: "Не удалось запросить заказ",
    });
  }
};
const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await orderModal.findByIdAndDelete({
      _id: req.params.id,
    });
    await sendMsgToEmail(
      deletedOrder.email,
      deletedOrder.totalPrice,
      deletedOrder.userCart,
      deletedOrder.phoneNum,
      "delete"
    );
    res.status(200).json({
      success: true,
      message: "Done",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Не удалось удалить заказ",
      error: err,
    });
  }
};

const editOrder = async (req, res) => {
  try {
    await orderModal
      .findByIdAndUpdate(
        {
          _id: req.params.id,
        },
        {
          ...req.body,
        },
        { new: true }
      )
      .then(async () => {
        await sendMsgToEmail(
          req.body.email,
          req.body.totalPrice,
          req.body.userCart,
          req.body.phoneNum,
          "statusEdit",
          req.body.orderStatus
        );
        return res.json({
          message: "Заказ успешно изменен",
          success: true,
        });
      })
      .catch((err) => {
        return res.json({
          message: "Не удалось обновить данные заказа",
          success: false,
          error: err,
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось отредактировать заказ",
      success: false,
    });
  }
};
module.exports = {
  createOrder,
  getAllOrders,
  getOrder,
  getUserOrders,
  deleteOrder,
  editOrder,
};
