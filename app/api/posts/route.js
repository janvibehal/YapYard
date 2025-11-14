import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Post from "../../../models/Post"; 
import User from "../../../models/User";
import cloudinary from "@/utils/cloudinary"; 
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

const VALID_MEDIA_TYPES = ["image", "video"]; 

//POST Handler
export async function POST(req) {
  try {
    await dbConnect();

    const token =
      req.headers.get("authorization")?.split(" ")[1] ||
      req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    
    const text = formData.get("text") || "";
    const mediaFiles = formData.getAll("mediaFile"); 
    const mediaTypes = formData.getAll("mediaType"); 

    const media = [];

    if (mediaFiles.length > 0) {
        for (let i = 0; i < mediaFiles.length; i++) {
            const file = mediaFiles[i];
            const rawMediaType = mediaTypes[i]; 

            const mediaType = rawMediaType && VALID_MEDIA_TYPES.includes(rawMediaType.toString().toLowerCase())
                ? rawMediaType.toString().toLowerCase()
                : null;
            
            // checking file.name as well, as some browsers send an empty File object if input is cancelled
            if (file instanceof File && file.size > 0 && file.name && mediaType) {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                const uploadResponse = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            
                            resource_type: mediaType, 
                            folder: "posts_media",
                            
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    uploadStream.end(buffer);
                });
                
                if (uploadResponse && uploadResponse.secure_url) {
                    media.push({
                        type: mediaType, 
                        url: uploadResponse.secure_url,
                        alt: "",
                    });
                }
            } else if (file instanceof File && file.size > 0 && !mediaType) {
                 console.warn(`Skipping file upload due to invalid media type: ${rawMediaType}`);
            }
        }
    }

    const newPost = await Post.create({
      author: decoded.id,
      text,
      media, 
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("❌ Post Creation Failed:", error);
    return NextResponse.json(
      { message: "Failed to create post", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();

    const posts = await Post.find()
      .populate("author", "name avatarUrl")
      .sort({ createdAt: -1 });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("❌ Failed to fetch posts:", error);
    return NextResponse.json(
      { message: "Failed to fetch posts", error: error.message },
      { status: 500 }
    );
  }
}