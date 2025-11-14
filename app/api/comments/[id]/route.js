import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Comment from "../../../../models/Comment";
import { verifyToken } from "../../../../utils/verifyToken";

export async function GET(req, { params }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing comment ID" }, { status: 400 });

  try {
    await dbConnect();
    const comment = await Comment.findById(id)
      .populate("author", "name avatarUrl")
      .populate("replies.author", "name avatarUrl");
    if (!comment) return NextResponse.json({ error: "Comment not found" }, { status: 404 });

    return NextResponse.json({ success: true, comment });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing comment ID" }, { status: 400 });

  const decoded = await verifyToken(req);
  if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();
    const data = await req.json();
    const comment = await Comment.findById(id);
    if (!comment) return NextResponse.json({ error: "Comment not found" }, { status: 404 });

    if (comment.author.toString() !== decoded.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    Object.assign(comment, data);
    await comment.save();
    return NextResponse.json({ success: true, comment });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing comment ID" }, { status: 400 });

  const decoded = await verifyToken(req);
  if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();
    const comment = await Comment.findById(id);
    if (!comment) return NextResponse.json({ error: "Comment not found" }, { status: 404 });

    if (comment.author.toString() !== decoded.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await Comment.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
