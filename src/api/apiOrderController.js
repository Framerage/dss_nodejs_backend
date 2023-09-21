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
// router.post(
//   "/auth/registration",
//   validations.registerValidation,
//   validationErrs.handleValidationErrs,
//   userController.userRegister
// );
// router.put("/auth/me", auth.checkAuth, userController.editUserExtraInfo);
// router.get("/auth/me", auth.checkAuth, userController.getUserInfo);
module.exports = router;
