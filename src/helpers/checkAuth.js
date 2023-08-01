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
        error: "Отсутствует доступ",
      });
    }
  } else {
    return res.status(403).json({
      error: "Нет доступа",
    });
  }
};
const checkAdmin = async (req, res, next) => {
  const token = req.headers.authorization || "".replace(/Bearer\s?/, "");
  const user = await userReg.findById(req.userId);
  if (!user) {
    console.log(user, "user");
    return res.status(404).json({
      error: "Пользователь не найден",
    });
  }
  const role = user.role;
  if (token && role === "admin") {
    try {
      const decodedToken = jwt.verify(token, "cucumberbl");
      req.userId = decodedToken._id;
      next();
    } catch (err) {
      return res.json({
        status: 403,
        error: "Отсутствует доступ к функционалу",
      });
    }
  } else {
    return res.json({
      status: 403,
      error: "Нет доступа к функционалу",
    });
  }
};
module.exports = {
  checkAuth,
  checkAdmin,
};
