const express = require("express");
const router = express.Router();

// Import controllers
const {
    capturePayment,
    verifySignature,
} = require("../controllers/Payments");

// Import middleware
const {
    auth,
    isStudent,
} = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Payment Routes
// ********************************************************************************************************

// Capture Payment and initiate Razorpay order (Students only)
router.post("/capturePayment", auth, isStudent, capturePayment);

// Verify Signature / Payment
router.post("/verifySignature", verifySignature);
router.post("/verifyPayment", verifySignature);

module.exports = router;
