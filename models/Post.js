import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, default: "" },
  feeling: { type: String, default: "" },      
  withUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  media: [
    {
      type: { type: String, enum: ["image", "video"], required: true },
      url: { type: String, required: true },
      alt: { type: String, default: "" }
    }
  ],
  emojis: [{ type: String }],                 
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  commentsCount: { type: Number, default: 0 },
  sharedCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model("Post", postSchema);
