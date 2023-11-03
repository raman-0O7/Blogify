const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser")
const userRoute = require("./routes/userRoute");
const staticRoute = require("./routes/staticRoute");
const blogRoute = require("./routes/blogRoute");
const {checkCookie} = require("./middleware/auth");


const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkCookie("token"));
app.use(express.static('public'));


mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/blogify").then(()=> console.log("mongodb connected")).catch((err)=> console.log(err.message));

app.use("/user", userRoute);
app.use("/", staticRoute);
app.use("/blog", blogRoute);

app.listen(PORT, ()=> console.log(`Server started at port ${PORT}`));