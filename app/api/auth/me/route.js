import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function GET(req) {
  try {
    await dbConnect();
    const auth = req.headers.get("authorization");
    if (!auth)
      return NextResponse.json({ error: "No token provided" }, { status: 401 });

    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(payload.id).select("-password");
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user });
  } catch (err) {
    console.error("Auth/me error:", err);
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}
