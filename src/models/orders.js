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
    orderStatus: {
      type: String,
      default: "в обработке",
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
    orderType: {
      type: String,
      default: "usual",
    },
    specImgsOrder: {
      type: Array,
      default: [],
    },
    orderNum: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
orderSchema.pre("save", function (next) {
  var docs = this;
  // const result =
   mongoose.model("Order", orderSchema).count(
    { _id: docs._id },
    //   , function (error, counter) {
    //   if (error) return next(error);
    //   docs.orderNum = counter + 1;
    next()
    // }
  );
  // console.log(result, "result");
  // next();
});
const userOrder = mongoose.model("Order", orderSchema);
module.exports = userOrder;
