import {Schema, model} from "mongoose";
import {createHmac, randomBytes} from "crypto";
import { createTokenForUser } from "../services/authentication.js";

const userSchema = new Schema({
    fullName:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true

    },
    password:{
        type: String,
        required: true
    },
    salt :{
        type: String,
    },
    profileImage: {
        type: String,
        default: "/image/userImage.jpg"
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"

    },
    forgetPasswordToken: {type : "String"},
    forgetPasswordExpiry: {type : "String",}
}, { timestamps: true})

userSchema.pre("save", function(next){
    const user = this;

    if(!user.isModified("password")) return next();
    const salt = randomBytes(16).toString()
    const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");

    user.password = hashedPassword;
    user.salt = salt;

    next();
})

userSchema.static("matchPasswordAndGenerateToken",async function(email, password) {
    const user = await USER.findOne({email});
    if(!user) throw new Error("User not found");

    const salt = user.salt;
    const userPassword = user.password;

    const providedPasswordHash = createHmac("sha256", salt).update(password).digest("hex");

    if(userPassword !== providedPasswordHash) throw new Error("Invalid Credentials")
    const token = createTokenForUser(user);
    return token;
});

userSchema.methods = {
    generateResetPasswordToken: async function() {
        const resetToken = randomBytes(20).toString("hex");
        const encryptedToken = createHmac("sha256", "SECRET").update(resetToken).digest("hex");
        this.forgetPasswordToken = encryptedToken;
        
        this.forgetPasswordExpiry = Date.now() + 15 * 60 * 1000;        
        return resetToken;
    }
}


const USER = model("user", userSchema);
export default USER;