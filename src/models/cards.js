const mongoose = require("mongoose");
const schema = mongoose.Schema;

const cardSchema = new schema(
  {
    title: {
      type: String,
      required: true,
    },
    descrip: {
      type: String,
      required: true,
      unique: true,
    },
    fullDescrip: {
      type: String,
    },
    styles: {
      type: Array,
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imgUrl: String,
  },
  { timestamps: true }
);
const cardModal = mongoose.model("Card", cardSchema);
module.exports = cardModal;
