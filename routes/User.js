const express = require("express");
const router = express.Router();

// Import controllers
const {
    login,
    signUp,
    sendOTP,
    changePassword,
} = require("../controllers/Auth");

const {
    resetPasswordToken,
    resetPassword,
} = require("../controllers/ResetPassword");

// Import middleware
const { auth } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Authentication Routes
// ********************************************************************************************************

// Route for user login
router.post("/login", login);

// Route for user signup
router.post("/signup", signUp);

// Route for sending OTP to user's email
router.post("/sendotp", sendOTP);

// Route for changing the password
router.post("/changepassword", auth, changePassword);

// ********************************************************************************************************
//                                      Reset Password Routes
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken);

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword);

module.exports = router;
