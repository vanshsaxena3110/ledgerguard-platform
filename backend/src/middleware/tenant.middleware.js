export const tenant = (req, res, next) => {
  if (!req.companyId) {
    return res.status(403).json({
      message: "Company information missing",
    });
  }

  next();
};