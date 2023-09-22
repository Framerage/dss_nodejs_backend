const cardModel = require("../models/cards");
const getAllCards = async (req, res) => {
  try {
    const cards = await cardModel.find().populate("user").exec();
    res.json(cards);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить карточки",
    });
  }
};

const getCard = async (req, res) => {
  const cardId = req.params.id;
  try {
    const card = await cardModel
      .findByIdAndUpdate(
        {
          _id: cardId,
        },
        { $inc: { viewsCount: 1 } },
        { new: true }
      )
      .populate("user")
      .exec();
    if (!card) {
      return res.status(404).json({
        error: "Not found",
        message: "Карточка не найдена",
      });
    }
    res.json(card);
  } catch (err) {
    console.log(err, "error result");
    res.status(500).json({
      error: "Problems with server",
      message: "Не удалось запросить карточку",
    });
  }
};
const createCard = async (req, res) => {
  try {
    const doc = new cardModel({
      title: req.body.title,
      descrip: req.body.descrip,
      fullDescrip: req.body.fullDescrip,
      price: req.body.price,
      imgUrl: req.body.imgUrl,
      user: req.userId,
      theme: req.body.theme,
    });

    const postCard = await doc.save();
    res.json({
      ...postCard,
      success: true,
      message: "Карточка успешно создалась",
      status: 200,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать карточку",
      success: false,
    });
  }
};

const deleteCard = async (req, res) => {
  try {
    await cardModel.findByIdAndDelete({
      _id: req.params.id,
    });
    res.status(200).json({
      success: true,
      message: "Done",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Не удалось удалить карточку",
      error: err,
    });
  }
};

const editCard = async (req, res) => {
  try {
    await cardModel
      .findByIdAndUpdate(
        {
          _id: req.params.id,
        },
        {
          ...req.body,
        },
        { new: true }
      )
      .then((card) => {
        return res.json({
          ...card._doc,
          success: true,
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось отредактировать карточку",
      success: false,
    });
  }
};
module.exports = { createCard, getAllCards, getCard, deleteCard, editCard };
