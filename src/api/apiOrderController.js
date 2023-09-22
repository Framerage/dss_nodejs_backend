const express = require("express");
const router = express.Router();
const validations = require("../validations/validations");
const { orderController } = require("../controllers");
const { auth, validationErrs } = require("../helpers");

router.post(
  "/create-order",
  auth.checkAuth,
  auth.checkUser,
  validations.orderValidation,
  validationErrs.handleValidationErrs,
  orderController.createOrder
);
router.post(
  "/orders",
  auth.checkAuth,
  auth.checkAdmin,
  auth.checkUser,
  orderController.getAllOrders
);
router.post(
  "/user-orders",
  auth.checkAuth,
  auth.checkUser,
  orderController.getUserOrders
);
router.get(
  "/user-orders/:id",
  auth.checkAuth,
  auth.checkUser,
  orderController.getOrder
);
router.delete(
  "/orders/:id",
  auth.checkAuth,
  auth.checkAdmin,
  orderController.deleteOrder
);
router.patch(
  "/orders/:id",
  auth.checkAuth,
  auth.checkAdmin,
  validations.orderValidation,
  validationErrs.handleValidationErrs,
  orderController.editOrder
);
module.exports = router;
