
export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const truncateText = (text, limit = 120) => {
  if (!text) return "";
  return text.length > limit ? text.slice(0, limit) + "..." : text;
};

export const sanitizeText = (text) => {
  if (!text) return "";
  return text.replace(/<[^>]+>/g, "");
};
