
export const MESSAGES = {
  AUTH: {
    REGISTER_SUCCESS: "User registered successfully. Please verify your email.",
    LOGIN_SUCCESS: "Login successful.",
    INVALID_CREDENTIALS: "Invalid email or password.",
    EMAIL_NOT_VERIFIED: "Please verify your email before continuing.",
    EMAIL_ALREADY_EXISTS: "Email already registered.",
    EMAIL_VERIFIED: "Email verified successfully.",
    UNAUTHORIZED: "Unauthorized access. Token missing or invalid.",
  },

  POST: {
    CREATED: "Post created successfully.",
    UPDATED: "Post updated successfully.",
    DELETED: "Post deleted successfully.",
    NOT_FOUND: "Post not found.",
    PERMISSION_DENIED: "You do not have permission to modify this post.",
  },

  COMMENT: {
    CREATED: "Comment added successfully.",
    UPDATED: "Comment updated successfully.",
    DELETED: "Comment deleted successfully.",
    NOT_FOUND: "Comment not found.",
    REPLY_ADDED: "Reply added successfully.",
    PERMISSION_DENIED: "You do not have permission to edit or delete this comment.",
  },

  LIKE: {
    TOGGLED: "Like toggled successfully.",
    NOT_FOUND: "Comment not found.",
  },

  ERROR: {
    SERVER_ERROR: "Internal server error.",
    INVALID_INPUT: "Invalid input data.",
    FORBIDDEN: "Forbidden.",
    NOT_FOUND: "Resource not found.",
  },
};
