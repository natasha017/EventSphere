const exhibitorMiddleware = (req, res, next) => {
  if (req.user?.role !== "exhibitor") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Exhibitor only.",
    });
  }

  next();
};

export default exhibitorMiddleware;
