import jwt from "jsonwebtoken";

const SECRET = "$uperman@123";
export function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role
    };

    return jwt.sign(payload, SECRET);
}

export function verifyToken(token) {
    const payload = jwt.verify(token, SECRET);
    return payload;
}


