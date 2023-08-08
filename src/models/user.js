const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    pass: {
      type: String,
      required: true,
    },
    persPromo: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "user",
    },
    bonuses: {
      type: Number,
      default: 0,
    },
    userCart: {
      type: Array,
      default: [],
    },
    userLikes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);
const userReg = mongoose.model("User", userSchema);
module.exports = userReg;
