const User = require(" .. /models/User");
const OTP = require(" .. /models/OTP");
const otpgenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
//sendOTP
exports.sendOTP = async (req, res) => {
try{
//fetch email from request ki body
const {email} = req.body;

//check if user already exist
const checkUserPresent = await User.findOne({email});

///if user already exist , then return a response
if (checkUserPresent) {
return res.status(401).json({
success: false,
message: "User already exist",
})
}
var otp = otpgenerator.generate(6, {
upperCaseAlphabets: false,
lowerCaseAlphabets: false,
specialChars: false,});
console.log("OTP generated is ", otp);
//check unique otp or not
let result = await OTP.findOne({otp: otp});

while(result){
otp = otpGenerator(6, {
upperCaseAlphabets : false,
lowerCaseAlphabets : false,
specialChars: false,
});
result = await OTP.findOne({otp: otp});

}
const otpPayload = {email, otp};
const otpBody = await OTP.create(otpPayload);
console.log(otpBody);
res.status(200).json({
success: true,
message: "OTP sent successfully",
otp,
});

}
catch(error){
    console.log(error);
    res.status(500).json({
success: false,
message:error.message,
    })

}

};



//signUp
exports.signUp = async (req, res) => {
    //data fetch from request ki body
    try{
const  {
firstName,
lastName,
email,
password,
confirmPassword,
accountType,
contactNumber,
otp
} = req.body;
//validate krlo
if(!firstName || !lastName || !email || !password || !confirmPassword || !accountType || !contactNumber || !otp){
    return res.status(400).json({
        success: false,
        message: "All fields are required",
    })
}
//2 password match krlo
//check user already exist or not
const existingUser = await User.findOne({email});
if(existingUser){
    return res.status(401).json({
        success: false,
        message: "User already exist",
    })
}

//find most recent OTP stored for the user
const recentOtp = await OTP.find({email}).sort({createdAt: -1}).limit(1);
console.log(recentOtp);
//validate OTP
if(recentOtp.length === 0){
    return res.status(400).json({
        success: false,
        message: "OTP not found",
    })
}
else if(otp !== recentOtp.otp ){
    return res.status(400).json({
        success: false,
        message: "Invalid OTP",
    })
}

const hashedPassword = await bcrypt.hash(password, 10);
//create user
const profileDetails = await Profile.create({
    gender:null,
    dateOfBirth:null,
    about:null,
    contactNumber:null,
});
const user = await User.create ( {
firstName,
lastName,
email,
password: hashedPassword,
accountType,
additionalDetails: profileDetails._id,
image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
})
return res.status(200).json({
success: true,
message: "User created successfully",
user,
});
    }
catch(error){
    console.log(error);
    return res.status(500).json({
success: false,
message:"user cannot be registered",
    })

}
}
exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;
// validation data
if(!email || !password) {
return res.status(403). json({
success : false,
message: 'All fields are required, please try again',

});
}

//user check exist or not
const user = await User.findOne({email}). populate("additionalDetails");
if(!user){
return res.status(401).json({
success: false,
message: "User not found, please signup",
})
}
if(await bcrypt.compare(password, user.password)){
    const payload = {
        email: user.email,
        id: user._id,
        accountType:user.accountType,}
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "2h"});
    user.token = token;
    user.password = undefined;
    const options = {
        expires: new Date(Date.now() + 3*24*60*60*1000),
        httpOnly: true,
    }
    res.cookie("token",token, options).status(200).json({
        success: true,
        token,
        user,
        message: "User logged in successfully",

    })
}
else {
    res.status(401).json({
success: false,
message: "Invalid credentials",
    });
}

//generate JWT, after password matching
//create cookie and send response

    }
    catch(error){
console.log(error);
return res.status(500).json({
success: false,
message: "User cannot be logged in",


    });
}
};
//change password 
// exports.changePassword = async (req, res) => {
//     try{
//         const {oldPassword, newPassword} = req.body;

