import {Schema, model} from "mongoose";

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    postedOn: {
        type: Schema.Types.ObjectId,
        ref: "blog"
    }
}, { timestamps: true });



const Comment = model("comment", commentSchema);
export default Comment;