const USER = require("../models/userModel");

async function handleUserSignup(req, res) {
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

async function handleUserLogin(req, res) {

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

module.exports = {
    handleUserSignup,
    handleUserLogin
}