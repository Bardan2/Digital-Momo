const {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOTP,
  resetPassword,
} = require("../controller/auth/authController");

const router = require("express").Router();

// routes here...
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/forgotPassword").post(forgotPassword);
router.route("/verifyOTP").post(verifyOTP);
router.route("/resetPassword").post(resetPassword);

module.exports = router;
