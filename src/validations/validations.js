const { body } = require("express-validator");
const registerValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("pass", "Пароль должен быть не менее 5 символов").isLength({ min: 5 }),
  body("name", "Имя должно быть не менее 3 символов").isLength({ min: 3 }),
  body("regPromo", "Некорректный промокод").optional().isString(),
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

const orderValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("phoneNum", "Номер должен иметь не менее 12 символов")
    .isLength({ min: 12 })
    .isMobilePhone(),
  body("name", "Имя должно быть не менее 3 символов").isLength({ min: 3 }),
  body("promo", "Некорректный промокод").optional().isString(),
  body("city", "Некорректный город").optional().isString(),
  body("orderType", "Некорректный тип").optional().isString(),
  body("specImgsOrder", "Некорректные картинки").optional().isArray(String),
];
const cartValidation=[
  body('userCart',"Неверный формат").isArray(String)
]
module.exports = {
  registerValidation,
  loginVlidation,
  cardCreateValidation,
  orderValidation,
  cartValidation
};
