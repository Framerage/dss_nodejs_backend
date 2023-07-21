const express = require("express");
require("dotenv").config();
const path = require("path");
const morgan = require("morgan");
const multer = require("multer");
const cors = require("cors");
const mongoose = require("mongoose");

const validations = require("./src/validations/validations");
const { cardController, userController } = require("./src/controllers");
const { auth, validationErrs } = require("./src/helpers");

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Sucsess connect"))
  .catch((err) => console.log(err));

const createPath = (page) => path.resolve(__dirname, `${page}.html`);
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

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(express.urlencoded({ extended: true }));
// app.use(cors);

app.get("/", (req, res) => {
  res.sendFile(createPath("index"));
});
app.get("/add-cards", (req, res) => {
  res.sendFile(createPath("createCard"));
});

app.get("/auth/login", (req, res) => {
  res.sendFile(createPath("login"));
});
app.get("/auth/registration", (req, res) => {
  res.sendFile(createPath("registration"));
});

app.post(
  "/auth/login",

  validations.loginVlidation,
  validationErrs.handleValidationErrs,
  userController.userLogin
);
app.post(
  "/auth/registration",

  validations.registerValidation,
  validationErrs.handleValidationErrs,
  userController.userRegister
);
app.get("/auth/me", auth.checkAuth, userController.getUserInfo);

app.post("/upload", auth.checkAuth, upload.single("image"), (req, res) => {
  console.log(req.file);
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/cards", cardController.getAllCards);
app.get("/cards/:id", cardController.getCard);
app.post(
  "/cards",
  auth.checkAuth,
  validations.cardCreateValidation,
  validationErrs.handleValidationErrs,
  cardController.createCard
);
app.delete("/cards/:id", auth.checkAuth, cardController.deleteCard);
app.patch(
  "/cards/:id",
  auth.checkAuth,
  validations.cardCreateValidation,
  validationErrs.handleValidationErrs,
  cardController.editCard
);

app.listen(PORT, (err) => {
  err ? console.log(err) : console.log(`Server opened on: ${serverURL}`);
});
