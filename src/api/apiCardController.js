const express = require("express");
const router = express.Router();
const { cardController } = require("../controllers");
const { auth, validationErrs } = require("../helpers");
const validations = require("../validations/validations");

router.get("/cards", cardController.getAllCards);
router.get("/cards/:id", cardController.getCard);
router.post(
  "/cards",
  auth.checkAuth,
  auth.checkAdmin,
  validations.cardCreateValidation,
  validationErrs.handleValidationErrs,
  cardController.createCard
);
router.delete(
  "/cards/:id",
  auth.checkAuth,
  auth.checkAdmin,
  cardController.deleteCard
);
router.patch(
  "/cards/:id",
  validations.cardCreateValidation,
  validationErrs.handleValidationErrs,
  cardController.editCard
);
router.put(
  "/cards/:id",
  auth.checkAuth,
  auth.checkAdmin,
  validations.cardCreateValidation,
  validationErrs.handleValidationErrs,
  cardController.editCard
);
module.exports = router;
