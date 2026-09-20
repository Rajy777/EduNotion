const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");

exports.resetPassword = async (req, res) => {
   try {
     const email = req.body.email;
    const user = await User.findOne({email: email});
    if(!user){
        return res.status(404).json({
success: false,
message: "User not found, please signup",
        });
    }
    const token = crypto.randomUUID();
    const updatedDetails = await User.findByIdAndUpdate( {email:email}, {
        token: token,
        resetPasswordExpires: Date.now() + 5*60*1000, // 5 minutes
    },
    {new: true});
    const url = `http://localhost:3000/resetpassword/${token}`;
    await mailSender(email,
        "Reset your password",
        `Password reset link: ${url}`
    );
    return res.json({
        success: true,
        message: "Password reset link sent to your email",
    });

   }
   catch(error){
console.log(error);
return res.status(500).json({
success: false,
message: "Something went wrong while sending the reset password link",
    });
   }
}

exports.resetPasswordHandler = async (req, res) => {
    try{
    const {password, confirmPassword,token} = req.body;
    if(password !== confirmPassword){
        return res.json({
success: false,
message: "Password and confirm password do not match",
        });
    }
    const userDetails = await User.findOne({token: token});
    if(!userDetails){
        return res.json({
success: false,
message: "Invalid token, please try again",
        });
    }
    if(userDetails.resetPasswordExpires < Date.now()){
        return res.json({
success: false,
message: "Token has expired, please try again",
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate({token: token},
        { password :hashedPassword},
        {new: true},
    );
    return res.json({
        success: true,
        message: "Password reset successful, please login with your new password",
    });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
success: false,
message: "Something went wrong while resetting the password",
        });
    }
       
}
    