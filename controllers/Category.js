const Category = require("../models/Category");
const Course = require("../models/Course");

// createCategory handler function
exports.createCategory = async (req, res) => {
    try {
        // Fetch data from request body
        const { name, description } = req.body;

        // Validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Create entry in DB
        const categoryDetails = await Category.create({
            name: name,
            description: description,
        });
        console.log(categoryDetails);

        return res.status(200).json({
            success: true,
            message: "Category created successfully",
            data: categoryDetails,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// showAllCategories handler function
exports.showAllCategories = async (req, res) => {
    try {
        const allCategories = await Category.find({}, { name: true, description: true });

        return res.status(200).json({
            success: true,
            message: "All categories fetched successfully",
            data: allCategories,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// categoryPageDetails handler function
exports.categoryPageDetails = async (req, res) => {
    try {
        const { category_id, categoryId } = req.body;
        const targetId = category_id || categoryId;

        const categoryDetails = await Category.findById(targetId).populate("courses").exec();
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category details not found",
            });
        }

        const differentCategories = await Category.find({
            _id: { $ne: targetId },
        }).populate("courses").exec();

        const getTopSellingCourses = await Course.find({
            category: targetId,
        }).sort({ createdAt: -1 }).limit(10).exec();

        return res.status(200).json({
            success: true,
            message: "Category details fetched successfully",
            data: {
                categoryDetails,
                differentCategories,
                getTopSellingCourses,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Aliases for alternate naming conventions
exports.createcategory = exports.createCategory;
exports.showAllCategory = exports.showAllCategories;
exports.showAllcategory = exports.showAllCategories;
exports.getCategoryPageDetails = exports.categoryPageDetails;
