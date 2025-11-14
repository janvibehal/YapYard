import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Post from "../../../../models/Post";
import { verifyToken } from "../../../../utils/verifyToken";

//GET single post
export async function GET(req, context) {
  try {
    await dbConnect();

    const { postId } = await context.params; 
    if (!postId) {
      return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
    }

    const post = await Post.findById(postId).populate("author", "name avatarUrl");
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, post });
  } catch (err) {
    console.error("Error fetching post:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

//UPDATE post
export async function PUT(req, context) {
  try {
    await dbConnect();

    const { postId } = await context.params;
    if (!postId) {
      return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
    }

    const decoded = await verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = decoded.id;
    const data = await req.json();

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.author.toString() !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    Object.assign(post, data);
    await post.save();

    return NextResponse.json({ success: true, post });
  } catch (err) {
    console.error("Error updating post:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

//DELETE post
export async function DELETE(req, context) {
  try {
    await dbConnect();

    const { postId } = await context.params;
    if (!postId) {
      return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
    }

    const decoded = await verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = decoded.id;
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.author.toString() !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Post.findByIdAndDelete(postId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting post:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
