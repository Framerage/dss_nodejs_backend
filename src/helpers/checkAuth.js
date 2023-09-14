const jwt = require("jsonwebtoken");
const userReg = require("../models/user");

const checkAuth = (req, res, next) => {
  const token = req.headers.authorization || "".replace(/Bearer\s?/, "");
  if (token) {
    try {
      const decodedToken = jwt.verify(token, "cucumberbl");
      req.userId = decodedToken._id;
      next();
    } catch (err) {
      return res.status(403).json({
        success: false,
        message: "Отсутствует доступ",
      });
    }
  } else {
    return res.status(403).json({
      success: false,
      message: "Нет доступа",
    });
  }
};
const checkAdmin = async (req, res, next) => {
  const token = req.headers.authorization || "".replace(/Bearer\s?/, "");
  console.log(req);
  const user = await userReg.findById(req.userId);
  if (!user) {
    return res.status(404).json({
      message: "Пользователь не найден",
    });
  }
  const role = user.role;
  if (token && role === "admin") {
    try {
      const decodedToken = jwt.verify(token, "cucumberbl");
      req.userId = decodedToken._id;
      next();
    } catch (err) {
      return res.status(403).json({
        status: 403,
        message: "Отсутствует доступ к функционалу",
      });
    }
  } else {
    return res.status(403).json({
      status: 403,
      message: "Нет доступа к функционалу",
    });
  }
};
const checkUser = async (req, res, next) => {
  const token = req.headers.authorization || "".replace(/Bearer\s?/, "");
  const user = await userReg.findOne(req.body.email);

  if (!user) {
    return res.status(404).json({
      message: "Пользователь не найден",
    });
  }
  const psS = user.pass;
  if (token && psS === token) {
    try {
      const decodedToken = jwt.verify(token, "cucumberbl");
      req.userId = decodedToken._id;
      next();
    } catch (err) {
      return res.status(403).json({
        status: 403,
        message: "Отсутствует доступ к функционалу",
      });
    }
  } else {
    return res.status(403).json({
      status: 403,
      message: "Нет доступа к функционалу",
    });
  }
};
module.exports = {
  checkAuth,
  checkAdmin,
  checkUser,
};
