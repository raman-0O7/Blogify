import {Router} from "express";
import {handleUserSignup, handleUserLogin, handleForgetPassword, handleResetPassword, handleChangePassword} from "../controllers/userController.js";

const router = Router();

router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);
router.post("/forgetpassword", handleForgetPassword);
router.get("/resetpassword/:resetToken", handleResetPassword);
router.get("/changepassword", handleChangePassword);


export default router;