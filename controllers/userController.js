import USER from "../models/userModel.js";
import AppError from "../utils/error.utils.js";
import {createHmac} from "crypto";
import sendEmail from "../utils/sendmail.utils.js";

export async function handleUserSignup(req, res) {
    const {fullName, email, password} = req.body;
    if(!fullName || !email || !password) {
        return res.render("signup", {
            error: "All Fields are required"
        });
    }
   
    try{
        await USER.create({
            fullName,
            email,
            password
        });
    } catch(err) {
        return res.render("signup", {
            error: "User not create",
            msg: err.message
        })

    }
    return res.redirect("/login");
}

export async function handleUserLogin(req, res) {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.render("login", {
            error: "All Fields are required"
        });
    }
    try{
        const token = await USER.matchPasswordAndGenerateToken(email, password);
        return res.cookie("token", token).redirect("/");
    } catch(err) {
        return res.render("login", {
            error: "Invalid Email or Password"
        })
    }

}

export async function handleForgetPassword(req, res, next) {
    try {
        const {email} = req.body;
        if(!email) {
            return next(new AppError("Email is required", 400));
        }
        const user = await USER.findOne({email});
        if(!user) {
            return next(new AppError('User not registered', 400));
        }
        const resetToken = await user.generateResetPasswordToken();
        await user.save();
        const resetTokenUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        const subject = "Reset Password";
        const message = `Click to the below link for resetting your Blogify account password ${resetTokenUrl}`;
    
        try {
            const result = await sendEmail(email, subject, message);
            return res.json({   
                message: "Success",
                resetToken: resetToken,
                result
            })
        } catch(err) {
            user.forgetPasswordToken ='';
            user.forgetPasswordExpiry = undefined;
            await user.save();
            return next(new AppError(`Some Error occured while sending you mail, please try later ${err.message}`, 500));
        }
    } catch(err) {
        return next(new AppError(`Error in token generation: ${err.message}`, 500));
    }
}

export async function handleResetPassword(req, res, next) {
    try {
        const { resetToken } = req.params;
        const { password } = req.body;
        if(!resetToken.trim() || !password.trim()) {
            return next(new AppError("Reset token and password is require", 400));
        }
        const forgetPasswordToken = createHmac("sha256", "SECRET").update(resetToken).digest("hex");
        const user = await USER.findOne({
            forgetPasswordToken,
            forgetPasswordExpiry : { $gt: Date.now()}
        });
    
        if(!user) {
            return next(new AppError("Invalid or expired token ,please try again", 400));
        }
    
        user.password = password;
        user.forgetPasswordExpiry = undefined;
        user.forgetPasswordToken = undefined;
        await user.save();
        user.password = undefined;
    
        return res.json({
            msg : " Password changed Success"
        });
    } catch (error) {
        return next(new AppError(`Error in resetting password: ${error.message}`, 500));
    }
}

export async function handleChangePassword(req, res) {
    const { oldPassword, newPassword } = req.body;
    if(!oldPassword || !newPassword) {
        return next(new AppError("All fields are required", 400));
    }

    const { id } = req.user;
    const user = await USER.findById(id).select("+password");
    if(!user) {
        return next(new AppError("User does not exist", 400));
    }

    const matchPassword = user.comparePassword(oldPassword);
    if(!matchPassword) {
        return next(new AppError("Old Password is incorrect, Please try again", 400));
    }

    user.password = newPassword;
    await user.save();
    user.password = undefined;
    return res.json({
        success: true,
        msg: "Password changed successfully"
    })
}

