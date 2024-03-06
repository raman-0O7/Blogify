import {config} from "dotenv";
config();
import express from "express";
const app = express();
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import staticRoute from "./routes/staticRoute.js";
import blogRoute from "./routes/blogRoute.js";
import {checkCookie} from "./middleware/auth.js";
import morgan from "morgan";


const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkCookie("token"));
app.use(express.static('public'));
app.use(morgan("dev"));


mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/blogify").then((connection)=> console.log(`mongodb connected ${connection.host}`)).catch((err)=> console.log(err.message));

app.use("/user", userRoute);
app.use("/", staticRoute);
app.use("/blog", blogRoute);

app.listen(PORT, ()=> console.log(`Server started at port ${PORT}`));