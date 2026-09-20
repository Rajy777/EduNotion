// Middleware to check if the user is a Student
const isStudent = async (req, res, next) => {
    try {
        // req.user is set by the auth middleware
        if (req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Students only",
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

module.exports = isStudent;
module.exports.isStudent = isStudent;
