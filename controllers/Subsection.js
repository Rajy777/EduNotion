const SubSection = require(" .. /models/SubSection");
const Section = require(" .. /models/Section");
const { uploadImageToCloudinary } = require(" .. /utils/imageUploader");

//create SubSection

exports.createSubSection = async (req, res) => {
    try {

        //fecth data from Req body
        const { sectionId, title, timeDuration, description } = req.body;
        //extract file/video
        const video = req.files.videoFile;
        //validation
        if (!sectionId || !title || !timeDuration || !description || !video) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }



        //upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        //create a sub-section
        const SubSectionDetails = await SubSection.create({
            title: title,
            timeDuration: tineDuration,
            description: description,
            videoUrl: uploadDetails.secure_url,
        })
        const updatedSection = await Section.findByIdAndUpdate({ _id: sectionId },
            {
                $push: {
                    subSection: subSectionDetails._id,
                }
            },
            { new: true });
        //HW: Log updated section here, after adding populate query
        //return response
        return res.status(200).json({
            succcess: true,
            message: 'Sub Section Created Successfully',
            updatedSection,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        })
    }
};

exports.updateSubSection = async (req, res) => {
    try {
        const { subSectionId, title, description } = req.body;
        if (!subSectionId) {
            return res.status(400).json({
                success: false,
                message: "SubSection ID is required",
            });
        }
        // Find the sub-section
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
        // Handle video update if a new file is sent
        if (req.files && req.files.videoFile) {
            const video = req.files.videoFile;
            const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
            subSection.videoUrl = uploadDetails.secure_url;
        }
        // Save the updated sub-section
        const updatedSubSection = await subSection.save();
        return res.status(200).json({
            success: true,
            message: "SubSection updated successfully",
            data: updatedSubSection,
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
exports.deleteSubSection = async (req, res) => {
    try {
        const { subSectionId, sectionId } = req.body;
        if (!subSectionId || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "SubSection ID and Section ID are required",
            });
        }
        // Delete the sub-section
        await SubSection.findByIdAndDelete(subSectionId);
        // Remove the sub-section ID from the parent section
        await Section.findByIdAndUpdate(sectionId, {
            $pull: { subSection: subSectionId },
        }, { new: true });
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