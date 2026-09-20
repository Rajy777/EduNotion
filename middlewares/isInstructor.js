// Middleware to check if the user is an Instructor
const isInstructor = async (req, res, next) => {
    try {
        // req.user is set by the auth middleware
        if (req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Instructors only",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again",
        });
    }
};

module.exports = isInstructor;
module.exports.isInstructor = isInstructor;
