import Post from "@/models/Post.js";
import User from "@/models/User.js";
import { canEditOrDelete } from "@/utils/permissions.js";

export const createPost = async (userId, data) => {
  const post = new Post({
    title: data.title,
    content: data.content,
    image: data.image || null,
    authorId: userId,
  });
  await post.save();
  return post;
};

export const getAllPosts = async () => {
  return Post.find()
    .populate("authorId", "name email")
    .sort({ createdAt: -1 });
};

export const getPostById = async (id) => {
  return Post.findById(id).populate("authorId", "name email");
};

export const updatePost = async (id, user, updates) => {
  const post = await Post.findById(id);
  if (!post) throw new Error("Post not found");

  if (!canEditOrDelete(post, user))
    throw new Error("Permission denied");

  Object.assign(post, updates);
  await post.save();
  return post;
};

export const deletePost = async (id, user) => {
  const post = await Post.findById(id);
  if (!post) throw new Error("Post not found");

  if (!canEditOrDelete(post, user))
    throw new Error("Permission denied");

  await Post.findByIdAndDelete(id);
  return { message: "Post deleted" };
};
