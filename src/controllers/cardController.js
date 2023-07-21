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
  try {
    const card = await cardModal
      .findByIdAndUpdate(
        {
          _id: cardId,
        },
        { $inc: { viewsCount: 1 } },
        { returnDocument: "after" },
        (err,
        (doc) => {
          if (err) {
            console.log(err);
            res.status(500).json({
              message: "Не удалось запросить карточку",
            });
          }
          if (!doc) {
            return res.status(404).json({
              message: "Карточка не найдена",
            });
          }
          res.json(doc);
        })
      )
      .populate("user")
      .exec();
    res.json(card);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить карточки",
    });
  }
};
const createCard = async (req, res) => {
  try {
    const doc = new cardModal({
      title: req.body.title,
      descrip: req.body.descrip,
      styles: req.body.styles,
      imgUrl: req.body.imgUrl,
      user: req.userId,
    });

    const postCard = await doc.save();
    res.json(postCard);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать карточку",
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
