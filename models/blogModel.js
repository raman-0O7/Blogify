import {Schema, model} from "mongoose";

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    blogImageURL: {
        type: String
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
}, { timestamps: true })


const Blog = model("blog", blogSchema);
export default Blog;