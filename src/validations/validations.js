const { body } = require("express-validator");
const registerValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("pass", "Пароль должен быть не менее 5 символов").isLength({ min: 5 }),
  body("name", "Имя должно быть не менее 3 символов").isLength({ min: 3 }),
  body("regPromo", "Некорректный промокод").optional().isLength({ min: 6 }),
];

const loginVlidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("pass", "Пароль должен быть не менее 5 символов").isLength({ min: 5 }),
];

const cardCreateValidation = [
  body("title", "Введите название карточки").isLength({ min: 3 }).isString(),
  body("descrip", "Введите описание карточки").isLength({ min: 5 }).isString(),
  body("fullDescrip", "Введите подробное описание карточки")
    .optional()
    .isString(),
  body("price", "Некорректная цена").optional().isNumeric(),
  body("likes", "Некорректные лайки").optional().isNumeric(),
  body("theme", "Некорректная тематика").isString(),
  body("imgUrl", "Некорректные картинки").optional().isArray(String),
];
module.exports = { registerValidation, loginVlidation, cardCreateValidation };
