const {Schema, model} = require("mongoose");
const {createHmac, randomBytes} = require("crypto");
const { createTokenForUser } = require("../services/authentication");

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

    }
}, { timestamps: true})

userSchema.pre("save", function(next){
    const user = this;

    if(!user.isModified("password")) return;
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
})


const USER = model("user", userSchema);
module.exports= USER;