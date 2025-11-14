import Comment from "@/models/Comment.js";

export const toggleLike = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error("Comment not found");

  const index = comment.likes.findIndex(
    (id) => id.toString() === userId.toString()
  );

  if (index >= 0) {
    comment.likes.splice(index, 1);
  } else {
    comment.likes.push(userId);
  }

  await comment.save();
  return { totalLikes: comment.likes.length, liked: index < 0 };
};

export const getLikes = async (commentId) => {
  const comment = await Comment.findById(commentId).populate("likes", "name email");
  if (!comment) throw new Error("Comment not found");
  return { totalLikes: comment.likes.length, users: comment.likes };
};
