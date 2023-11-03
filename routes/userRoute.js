const {Router} = require("express");
const router = Router();
const {handleUserSignup, handleUserLogin} =require("../controllers/userController");

router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);

module.exports = router;