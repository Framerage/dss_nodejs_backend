const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userReg = require("../models/user");
const accessMails = ["officialigonin@mail.ru"];
const userRegister = async (req, res) => {
  try {
    const password = req.body.pass;
    const userEmail = req.body.email;
    const role = () => {
      if (accessMails.includes(userEmail)) {
        return "admin";
      }
      return "user";
    };
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);
    const { name, email, regPromo, persPromo } = req.body;
    const userDoc = new userReg({
      name,
      email,
      pass: hashPass,
      regPromo,
      persPromo,
      role: role(),
    });

    const user = await userDoc.save();
    const { pass, ...userData } = user._doc;
    res.json({
      ...userData,
      message: "Регистрация прошла успешно",
      success: true,
      status: 200,
    });
  } catch (err) {
    console.log(err, "errorrr");
    const reason =
      req.body.email === err.keyValue?.email
        ? "Такая почта уже зарегистрирована"
        : "Ошибочные данные";
    res.status(403).json({ message: reason, success: false });
  }
};
const userLogin = async (req, res) => {
  try {
    const user = await userReg.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "Пользователь не найден",
      });
    }
    const isValidPass = await bcrypt.compare(req.body.pass, user._doc.pass);
    if (!isValidPass) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: "Неверный логин или пароль",
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "cucumberbl",
      {
        expiresIn: "1d",
      }
    );
    const { pass, ...userData } = user._doc;
    res.json({
      ...userData,
      token,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Не удалось авторизоваться",
    });
  }
};
const getUserInfo = async (req, res) => {
  try {
    const user = await userReg.findById(req.userId);
    if (!user) {
      console.log(user, "user");
      return res.status(404).json({
        status: 404,
        message: "Пользователь не найден",
      });
    }
    const { pass, ...userData } = user._doc;
    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(402).json({
      status: 402,
      message: "Какая-то ошибка",
    });
  }
};
module.exports = {
  userRegister,
  userLogin,
  getUserInfo,
};
