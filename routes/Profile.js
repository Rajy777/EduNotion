const express = require("express");
const router = express.Router();

// Import middleware
const { auth } = require("../middlewares/auth");

// Import controllers
const {
    deleteAccount,
    updateProfile,
    getAllUserDetails,
} = require("../controllers/Profile");

// ********************************************************************************************************
//                                      Profile Routes
// ********************************************************************************************************

// Delete User Account
router.delete("/deleteProfile", auth, deleteAccount);

// Update User Profile Details
router.put("/updateProfile", auth, updateProfile);

// Get User Details
router.get("/getUserDetails", auth, getAllUserDetails);

module.exports = router;
