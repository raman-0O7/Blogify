import {Router} from "express";
import multer from "multer";
import Blog from "../models/blogModel.js";
import Comment from "../models/commentModel.js";
const router = Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      return cb(null, './public/blog')
    },
    filename: function (req, file, cb) {
      return cb(null, `${Date.now()}-${file.originalname}`)
    }
});

const upload = multer({storage});


router.post("/add",upload.single("blogImageURL"),async (req, res)=> {
    console.log(req.file);
    console.log(req.body);
    const {title, body} = req.body;

    const blog = await Blog.create({
        title,
        body,
        blogImageURL: `/blog/${req.file.filename}`,
        createdBy: req.user._id
    });

    return res.redirect("/");
});

router.get("/:id",async (req, res)=>{
    const blogId = req.params.id;
    const blog = await Blog.findOne({ _id:blogId }).populate("createdBy");
    const comments = await Comment.find({ postedOn:blogId}).populate("createdBy");
    if(!blog) return res.end("No Blog Found");
    return res.render("viewBlog", {
      blog,
      user: req.user,
      comments
    });
    
})

router.post("/addComment/:id", async (req,res)=> {
  await Comment.create({
    content: req.body.content,
    postedOn: req.params.id,
    createdBy: req.user._id
  });
  return res.redirect(`/blog/${req.params.id}`);
})



export default router;