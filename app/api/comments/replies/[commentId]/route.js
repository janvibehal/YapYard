import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "../../../../../lib/dbConnect";
import Comment from "../../../../../models/Comment";
import User from "../../../../../models/User";
import jwt from "jsonwebtoken";

dbConnect();

/* ------------------------- AUTH MIDDLEWARE ------------------------- */
function getUserFromAuth(req) {
  const auth = req.headers.get("authorization");
  if (!auth) return null;

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch {
    return null;
  }
}

/* ------------------------------- POST REPLY ------------------------------- */

export async function POST(req, { params }) {
  try {
    await dbConnect();

    const { commentId } = await params;
    const body = await req.json();

    const { userId, text, emojis } = body;

    if (!userId || !text) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    const reply = {
      author: userId,       
      text,
      emojis: emojis || [],
      likes: [],
    };

    comment.replies.push(reply);

    await comment.save();

    const newReply = comment.replies[comment.replies.length - 1];

    return NextResponse.json({ success: true, reply: newReply });
  } catch (err) {
    console.error("Error adding reply:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}