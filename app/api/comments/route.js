import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Comment from "../../../models/Comment";
import { verifyToken } from "../../../utils/verifyToken";

// getting all comments for a post
export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const postId = url.searchParams.get("postId");
    if (!postId) return NextResponse.json({ error: "Missing postId" }, { status: 400 });

    const comments = await Comment.find({ post: postId })
      .populate("author", "name avatarUrl")
      .populate("replies.author", "name avatarUrl")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, comments });
  } catch (err) {
    console.error("Error fetching comments:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST create new comment
export async function POST(req) {
  try {
    await dbConnect();
    const decoded = await verifyToken(req);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { postId, text } = await req.json();
    if (!postId) return NextResponse.json({ error: "Missing postId" }, { status: 400 });

    const newComment = await Comment.create({
      post: postId,
      
      author: decoded.id,
      text: text || "",
      likes: [],
      replies: [],
    });

    const populatedComment = await newComment.populate("author", "name avatarUrl");

    
    return NextResponse.json({ success: true, comment: populatedComment }, { status: 201 });
  } catch (err) {
    console.error("Error creating comment:", err);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
