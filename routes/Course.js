const express = require("express");
const router = express.Router();

// Import Course Controllers
const {
    createCourse,
    showAllCourses,
} = require("../controllers/Course");

// Import Category Controllers
const {
    createCategory,
    showAllCategories,
    categoryPageDetails,
} = require("../controllers/Category");

// Import Section Controllers
const {
    createSection,
    updateSection,
    deleteSection,
} = require("../controllers/Section");

// Import SubSection Controllers
const {
    createSubSection,
    updateSubSection,
    deleteSubSection,
} = require("../controllers/Subsection");

// Import Rating and Review Controllers
const {
    createRating,
    getAverageRating,
    getAllRating,
} = require("../controllers/RatingAndReview");

// Import Middlewares
const {
    auth,
    isInstructor,
    isStudent,
    isAdmin,
} = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Course Routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse);

// Get all Courses
router.get("/getAllCourses", showAllCourses);
router.get("/showAllCourses", showAllCourses);

// ********************************************************************************************************
//                                      Section Routes
// ********************************************************************************************************

// Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection);

// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection);

// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection);

// ********************************************************************************************************
//                                      SubSection Routes
// ********************************************************************************************************

// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection);

// Update a Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection);

// Delete a Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);

// ********************************************************************************************************
//                                      Category Routes (Admin only for creation)
// ********************************************************************************************************

// Category can Only be Created by Admin
router.post("/createCategory", auth, isAdmin, createCategory);

// Get All Categories
router.get("/showAllCategories", showAllCategories);

// Get Category Page Details
router.post("/getCategoryPageDetails", categoryPageDetails);

// ********************************************************************************************************
//                                      Rating and Review Routes
// ********************************************************************************************************

// Create a Rating and Review
router.post("/createRating", auth, isStudent, createRating);

// Get Average Rating
router.get("/getAverageRating", getAverageRating);

// Get all Reviews
router.get("/getReviews", getAllRating);

module.exports = router;
