const { instance } = require(" .. /config/razorpay");
const Course = require(" .. /models/Course");
const User = require(" .. /models/User");
const mailSender = require(" .. /utils/mailSender");
const { courseEnrollmentEmail } = require(" .. /mail/templates/courseEnrollmentEmail");

//capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
    //get courseId and UserID
    const { course_id } = req.body;
    const userId = req.user.id;
    //validation
    //valid courseID
    if (!course_id) {
        return res.json({
            success: false,
            message: 'Please provide valid course ID',
        })
    };
    //valid courseDetail
    let course;
    try {
        course = await Course.findById(course_id);
        if (!course) {
            return res.json({
                success: false,
                message: 'Could not find the course',
            });
        }
        //user already pay for the same course
        const uid = new mongoose.Types.ObjectId(userId);
        if (course.studentsEnrolled.includes(uid)) {
            return res.status(200).json({
                success: false,
                message: 'Student is already enrolled',
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount: amount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes: {
            courseId: course_id,
            userId,
        }
    };
    try {
        //initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
        });
    }
    catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: "Could not initiate order",
        });
    }
    //return response
    //user already pay for the same course
    //order create
    //return response
};

exports.verifySignature = async (req, res) => {
    const webhookSecret = "12345678";

    const signature = req.headers("x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (signature === digest) {
        console.log("Payment is Authorised");

        const { courseId, wserId } = req.body.payload.payment.entity.notes;

        try {
            const enrolledCourse = await Course.findByIdAndUpdate(
                { _id: courseId },
                { $push: { studentsEnrolled: userId } },
                { new: true },
            );

            const user = await User.findByIdAndUpdate(
                { _id: userId },
                { $push: { courses: courseId } },
                { new: true },
            );
            if (!enrolledCourse || !user) {
                return res.status(400).json({
                    success: false,
                    message: "Payment not verified successfully",
                });
            }

            console.log("Enrolled course", enrolledCourse);
            console.log("Enrolled user", user);
            const enrolledStudent = await User.findOneAUpdate(
                { _id: userId },
                { $push: { courses: courseId } },
                { new: true },
            );
            //send mail to the user
            const emailResponse = await mailSender(
                user.email,
                "Congratulations! You have been enrolled in the course",
                courseEnrollmentEmail(user.firstName, course.courseName),
            );

            console.log("Email sent successfully", emailResponse);

            return res.status(200).json({
                success: true,
                message: "Payment verified successfully",
            });

        }

        catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Payment not verified successfully",
            });
        }
    }
    else {
        return res.status(400).json({
            success: false,
            message: "Payment not verified successfully",
        });
    }
}