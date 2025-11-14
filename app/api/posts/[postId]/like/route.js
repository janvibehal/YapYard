import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import Post from "../../../../../models/Post";
import { verifyToken } from "../../../../../utils/verifyToken";

export async function POST(req, context) {
  const { postId } = await context.params;

  // verifying user token
  const decoded = await verifyToken(req);
  if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();

    const post = await Post.findById(postId);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    const userId = decoded.id;
    const liked = post.likes.includes(userId);

    if (liked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    return NextResponse.json({ success: true, likes: post.likes.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server failed to process like" }, { status: 500 });
  }
}
