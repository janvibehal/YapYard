
export const canEditOrDelete = (resource, user) => {
  if (!resource || !user) return false;

  if (user.role === "admin") return true;
  return resource.author?.toString() === user._id?.toString();
};

export const isAdmin = (user) => user && user.role === "admin";

export const canInteract = (user) => user && user.isVerified === true;
