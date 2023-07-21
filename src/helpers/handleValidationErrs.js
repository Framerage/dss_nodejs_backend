const { validationResult } = require("express-validator");

const handleValidationErrs = (req, res, next) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    return res.status(400).json(errs.array());
  }
  next();
};
module.exports = { handleValidationErrs };
