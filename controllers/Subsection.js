const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/ImageUploader");
require("dotenv").config();

// CREATE SubSection
exports.createSubSection = async (req, res) => {
    try {
        // Fetch data from req.body
        const { sectionId, title, timeDuration, description } = req.body;

        // Extract video file from req.files
        const video = req.files?.videoFile;

        // Validation
        if (!sectionId || !title || !timeDuration || !description || !video) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Upload video to Cloudinary
        const uploadDetails = await uploadImageToCloudinary(
            video,
            process.env.FOLDER_NAME
        );

        // Create a new SubSection in DB
        const subSectionDetails = await SubSection.create({
            title: title,
            timeDuration: `${uploadDetails.duration || timeDuration}`,
            description: description,
            videoUrl: uploadDetails.secure_url,
        });

        // Update Section with this SubSection ObjectId
        const updatedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $push: {
                    subSection: subSectionDetails._id,
                },
            },
            { new: true }
        ).populate("subSection");

        // Return response
        return res.status(200).json({
            success: true,
            message: "SubSection created successfully",
            data: updatedSection,
        });
    } catch (error) {
        console.error("Error creating SubSection:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

// UPDATE SubSection
exports.updateSubSection = async (req, res) => {
    try {
        // Fetch data from req.body
        const { sectionId, subSectionId, title, description } = req.body;

        // Find existing SubSection
        const subSection = await SubSection.findById(subSectionId);

        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            });
        }

        // Update fields if provided
        if (title !== undefined) {
            subSection.title = title;
        }

        if (description !== undefined) {
            subSection.description = description;
        }

        // Check if video file is also being updated
        if (req.files && req.files.videoFile !== undefined) {
            const video = req.files.videoFile;
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME
            );
            subSection.videoUrl = uploadDetails.secure_url;
            subSection.timeDuration = `${uploadDetails.duration}`;
        }

        // Save updated SubSection
        await subSection.save();

        // Find updated section if sectionId is provided
        const updatedSection = sectionId
            ? await Section.findById(sectionId).populate("subSection")
            : null;

        // Return success response
        return res.status(200).json({
            success: true,
            message: "SubSection updated successfully",
            data: updatedSection || subSection,
        });
    } catch (error) {
        console.error("Error updating SubSection:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the SubSection",
            error: error.message,
        });
    }
};

// DELETE SubSection
exports.deleteSubSection = async (req, res) => {
    try {
        // Fetch subSectionId and sectionId from req.body (or req.params)
        const { subSectionId, sectionId } = req.body;

        // Validation
        if (!subSectionId || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "subSectionId and sectionId are required",
            });
        }

        // Remove SubSection ObjectId from Section
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $pull: {
                    subSection: subSectionId,
                },
            }
        );

        // Delete SubSection from DB
        const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId });

        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            });
        }

        // Fetch updated section with populated subSections
        const updatedSection = await Section.findById(sectionId).populate("subSection");

        // Return response
        return res.status(200).json({
            success: true,
            message: "SubSection deleted successfully",
            data: updatedSection,
        });
    } catch (error) {
        console.error("Error deleting SubSection:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the SubSection",
            error: error.message,
        });
    }
};

// Aliases to support multiple naming styles (camelCase / PascalCase)
exports.createSubsection = exports.createSubSection;
exports.updateSubsection = exports.updateSubSection;
exports.deleteSubsection = exports.deleteSubSection;
