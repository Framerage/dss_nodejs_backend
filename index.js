const express = require("express");
require("dotenv").config();
// const path = require("path");
const morgan = require("morgan");
const multer = require("multer");
const cors = require("cors");
const mongoose = require("mongoose");

const { auth } = require("./src/helpers");
const apiCardController = require("./src/api/apiCardController");
const apiUserController = require("./src/api/apiUserController");
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Sucsess connect"))
  .catch((err) => console.log(err));

// const createPath = (page) => path.resolve(__dirname, `${page}.html`);
const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const PORT = process.env.APP_PORT || 3333;
const serverURL = `http://127.0.0.1:${PORT}`;

app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static("uploads"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(express.urlencoded({ limit: "15mb", extended: true }));
app.use(cors());

// app.post(
//   "/auth/login",
//   validations.loginVlidation,
//   validationErrs.handleValidationErrs,
//   userController.userLogin
// );
// app.post(
//   "/auth/registration",
//   validations.registerValidation,
//   validationErrs.handleValidationErrs,
//   userController.userRegister
// );
// app.get("/auth/me", auth.checkAuth, userController.getUserInfo);

app.post(
  "/upload",
  auth.checkAuth,
  auth.checkAdmin,
  upload.single("image"),
  (req, res) => {
    console.log(req.file);
    res.json({
      url: `/uploads/${req.file.originalname}`,
    });
  }
);
app.use(apiCardController);
app.use(apiUserController);

app.listen(PORT, (err) => {
  err ? console.log(err) : console.log(`Server opened on: ${serverURL}`);
});
