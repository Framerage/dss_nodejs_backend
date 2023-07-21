const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  const token = req.headers.authorization || "".replace(/Bearer\s?/, "");
  console.log(req.headers.authorization);
  if (token) {
    try {
      const decodedToken = jwt.verify(token, "cucumberbl");
      req.userId = decodedToken._id;
      next();
    } catch (err) {
      return res.status(403).json({
        message: "Отсутствует доступ",
      });
    }
  } else {
    return res.status(403).json({
      message: "Нет доступа",
    });
  }
};
module.exports = {
  checkAuth,
};
