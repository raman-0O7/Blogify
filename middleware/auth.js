const { verifyToken } = require("../services/authentication");


function checkCookie(cookieName) {
    return (req, res, next) => {
        const cookie = req.cookies[cookieName];
        if(!cookie) return next();

        try{
            const payload = verifyToken(cookie);
            req.user = payload;
        } catch(err) {
        }
         return next();

    }
}


module.exports = {
    checkCookie
}