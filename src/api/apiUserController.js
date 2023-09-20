const express = require("express");
const router = express.Router();
const validations = require("../validations/validations");
const { userController } = require("../controllers");
const { auth, validationErrs } = require("../helpers");

router.post(
  "/auth/login",
  validations.loginVlidation,
  validationErrs.handleValidationErrs,
  userController.userLogin
);
router.post(
  "/auth/registration",
  validations.registerValidation,
  validationErrs.handleValidationErrs,
  userController.userRegister
);
router.put("/auth/me", auth.checkAuth, userController.editUserExtraInfo);
router.get("/auth/me", auth.checkAuth, userController.getUserInfo);
module.exports = router;
