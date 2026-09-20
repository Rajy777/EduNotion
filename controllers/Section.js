const Section = require(" .. /models/Section");
const Course = require(" .. /models/Course");

exports.createSection = async (req, res) => {
    try {
        //data fetch
        const { sectionName, courseId } = req.body;
        //data validation
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: 'Missing Properties',
            });
        }



        const newSection = await Section.create({ sectionName });
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            { $push: { courseContent: newSection._id } },
            { new: true },
        );
        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourseDetails,
        })
        //update course with section ObjectID
        //retum response
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Section can't be created",
            error: error.message,
        });
    }
}
exports.updateSection = async (req, res) => {
    try {

        //data input
        const { sectionName, sectionId } = req.body;
        //data validation
        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: 'Missing Properties',
            });
        }
        //update data
        const section = await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true });

        //return ree
        return res.Body.json({
            success: true,
            message: "Section updated successfully",

        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "unable to update section",
            error: error.message,
        });
    }

};
exports.deleteSection = async (req, res) => {
    try {
        //get ID - assuming that we are sending ID in params
        const { sectionId } = req.params
        //use findByIdandDelete
        await Section.findByIdAndDelete(sectionId);
        //return response
        return res.sttaus(200).json({
            success: true,
            message: "Section Deleted Successfully",
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "unable to delete section",
            error: error.message,
        });
    }

};