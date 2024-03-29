import {Router} from "express";
import Blog from "../models/blogModel.js";
const router = Router();


router.get("/", async (req, res)=>{
    const allBlogs = await Blog.find({});
    return res.render("home", {
        user: req.user,
        blogs: allBlogs
    });
});

router.get("/signup", (req, res)=> {
    return res.render("signup");
});

router.get("/login", (req, res)=> res.render("login"));

router.get("/logout", (req, res) => {
    return res.clearCookie("token").redirect("/");
})

router.get("/addBlog", (req,res)=>  res.render("addBlog", {
    user: req.user
}));



export default router;