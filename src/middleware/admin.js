module.exports = function(req, res, next) {
  //403 - Forbidden
  if (!req.user.isAdmin)
    return res.status(403).json({ status: false, message: "Access Forbidden" });
  next();
};
