const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
email: {
type:String,
required: true,
},
otp:{
type:String,
required: true,
},
createdAt: {
type:Date,
default:Date.now(),
expires: 5*60,}
});

async function sendVerificationEmail(email, otp) {
    try{
        const mailResponse = await mailSender(email, 
        "Verify your email",
        `Your OTP is ${otp}. It will expire in 5 minutes.`
        );
        console.log("Mail sent successfully", mailResponse);

    }
    catch(error){
        console.log("error occured while sending mail",error);
        throw error;
    }
}
OPTSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email, this.otp);
    next();
});
module.exports = mongoose.model("OTP", OTPSchema);