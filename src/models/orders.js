const mongoose = require("mongoose");
const schema = mongoose.Schema;

const orderSchema = new schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNum: {
      type: String,
      required: true,
    },
    promo: {
      type: String,
      default: "",
    },
    userCart: {
      type: Array,
      default: [],
    },
    city: {
      type: String,
      default: "",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const userOrder = mongoose.model("Order", orderSchema);
module.exports = userOrder;
