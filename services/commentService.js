// services/commentService.js
import Comment from "@/models/Comment.js";
import Post from "@/models/Post.js";
import { canEditOrDelete } from "@/utils/permissions.js";

export const createComment = async (userId, { postId, parentComment, content }) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");

  const comment = new Comment({
    post: postId,
    author: userId,
    content,
    parentComment: parentComment || null,
  });

  await comment.save();
  return comment;
};

export const getCommentsByPost = async (postId) => {
  const comments = await Comment.find({ post: postId, parentComment: null })
    .populate("author", "name email")
    .sort({ createdAt: -1 });

  const populateReplies = async (comment) => {
    const replies = await Comment.find({ parentComment: comment._id })
      .populate("author", "name email")
      .sort({ createdAt: 1 });

    const nested = await Promise.all(replies.map(populateReplies));
    return { ...comment.toObject(), replies: nested };
  };

  const threaded = await Promise.all(comments.map(populateReplies));
  return threaded;
};

export const updateComment = async (id, user, content) => {
  const comment = await Comment.findById(id);
  if (!comment) throw new Error("Comment not found");

  if (!canEditOrDelete(comment, user))
    throw new Error("Permission denied");

  comment.content = content;
  await comment.save();
  return comment;
};

export const deleteComment = async (id, user) => {
  const comment = await Comment.findById(id);
  if (!comment) throw new Error("Comment not found");

  if (!canEditOrDelete(comment, user))
    throw new Error("Permission denied");

  await deleteNestedReplies(id);
  await Comment.findByIdAndDelete(id);

  return { message: "Comment deleted" };
};

// Recursive helper
const deleteNestedReplies = async (parentId) => {
  const replies = await Comment.find({ parentComment: parentId });
  for (const reply of replies) {
    await deleteNestedReplies(reply._id);
    await Comment.findByIdAndDelete(reply._id);
  }
};
