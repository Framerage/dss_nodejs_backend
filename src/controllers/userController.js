const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userReg = require("../models/user");

const userRegister = async (req, res) => {
  try {
    const password = req.body.pass;
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);
    const { name, email } = req.body;
    const userDoc = new userReg({ name, email, pass: hashPass });

    const user = await userDoc.save();

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
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Регистрация не удалась" });
  }
};
const userLogin = async (req, res) => {
  try {
    const user = await userReg.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }
    const isValidPass = await bcrypt.compare(req.body.pass, user._doc.pass);
    if (!isValidPass) {
      return res.status(400).json({
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
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалась авторизоваться" });
  }
};
const getUserInfo = async (req, res) => {
  try {
    const user = await userReg.findById(req.userId);
    if (!user) {
      console.log(user, "user");
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }
    const { pass, ...userData } = user._doc;
    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(402).json({ message: "Какая-то ошибка" });
  }
};
module.exports = {
  userRegister,
  userLogin,
  getUserInfo,
};
