import { NextResponse } from "next/server";
import Comment from "../../../../../models/Comment";
import dbConnect from "../../../../../lib/dbConnect";
import { verifyToken } from "../../../../../utils/verifyToken";

export async function PUT(req, { params }) {
  await dbConnect();
  const user = await verifyToken(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { commentId } = await params; 
  if (!commentId) return NextResponse.json({ error: "Missing commentId" }, { status: 400 });

  try {
    let comment = await Comment.findById(commentId);
    if (comment) {
      const index = comment.likes.indexOf(user._id);
      if (index === -1) comment.likes.push(user._id);
      else comment.likes.splice(index, 1);

      await comment.save();
      return NextResponse.json({ success: true, likes: comment.likes.length });
    }

  
    comment = await Comment.findOne({ "replies._id": commentId });
    if (!comment) return NextResponse.json({ error: "Comment not found" }, { status: 404 });

    const reply = comment.replies.id(commentId);
    if (!reply.likes) reply.likes = [];

    const replyIndex = reply.likes.indexOf(user._id);
    if (replyIndex === -1) reply.likes.push(user._id);
    else reply.likes.splice(replyIndex, 1);

    await comment.save();
    return NextResponse.json({ success: true, likes: reply.likes.length });
  } catch (err) {
    console.error("Error toggling like:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
