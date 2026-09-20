// Middleware to check if the user is an Admin
const isAdmin = async (req, res, next) => {
    try {
        // req.user is set by the auth middleware
        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Admins only",
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

module.exports = isAdmin;
module.exports.isAdmin = isAdmin;
