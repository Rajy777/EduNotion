const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../../models/User");

exports.auth = async (req, res, next) => {
    try {
        // extract token
        const token = req.cookies?.token
            || req.body?.token
            || req.header("Authorization")?.replace("Bearer ", "")
            || req.header("Authorisation")?.replace("Bearer ", "");

        //if token missing, then return response
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token is missing',
            });
        }
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;


        }
        catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid",
            });
        }
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while verifying the token",
        });
    }
}
exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for students",
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "user role could not be verified",
        });
    }
}

exports.isInstructor = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for instructor",
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "user role could not be verified",
        });
    }
}

exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for admins",
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "user role could not be verified",
        });
    }
}


