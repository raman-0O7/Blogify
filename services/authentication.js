const jwt = require("jsonwebtoken");

const SECRET = "$uperman@123";
function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role
    };

    return jwt.sign(payload, SECRET);
}

function verifyToken(token) {
    const payload = jwt.verify(token, SECRET);
    return payload;
}


module.exports = {
    verifyToken,
    createTokenForUser
}