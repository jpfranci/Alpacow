const httpsRedirect = (req, res, next) => {
  if (req.protocol !== "https" && process.env.NODE_ENV !== "development") {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  next();
};

module.exports = {
  httpsRedirect,
};
