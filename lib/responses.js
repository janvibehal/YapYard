export function success(res, data = {}, status = 200) {
  return res.status(status).json({ success: true, data });
}

export function error(res, message = "Something went wrong", status = 500) {
  return res.status(status).json({ success: false, message });
}

export function unauthorized(res, message = "Unauthorized") {
  return res.status(401).json({ success: false, message });
}

export function notFound(res, message = "Not Found") {
  return res.status(404).json({ success: false, message });
}
