const { response } = require("express");
const cardModal = require("../models/cards");
const getAllCards = async (req, res) => {
  try {
    const cards = await cardModal.find().populate("user").exec();
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
  console.log(cardId, "test id");
  try {
    const card = await cardModal
      .findByIdAndUpdate(
        {
          _id: cardId,
        },
        { $inc: { viewsCount: 1 } },
        { new: true }
        // (err, doc) => {
        //   if (err) {
        //     console.log(err);
        //     res.status(500).json({
        //       message: "Не удалось получить карточку",
        //     });
        //     return;
        //   }
        //   if (!doc) {
        //     return res.status(404).json({
        //       message: "Карточка не найдена",
        //     });
        //   }
        //   res.json(doc);
        // }
      )
      .populate("user")
      .exec();
    res.json(card);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось запросить карточку",
    });
  }
};
const createCard = async (req, res) => {
  try {
    const doc = new cardModal({
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
    await cardModal.findByIdAndDelete(
      {
        _id: req.params.id,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            message: "Ошибка запроса на уделение карточки",
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: "Удаляемая карточка не найдена",
          });
        }
        res.json({
          success: true,
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить карточки",
    });
  }
};

const editCard = async (req, res) => {
  try {
    await cardModal.updateOne(
      {
        _id: req.params.id,
      },
      {
        ...req.body,
      }
    );
    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось отредактировать карточку",
    });
  }
};
module.exports = { createCard, getAllCards, getCard, deleteCard, editCard };
