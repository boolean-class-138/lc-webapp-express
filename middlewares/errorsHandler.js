const errorsHandler = (err, req, res, next) => {
  return res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
};

module.exports = errorsHandler;
