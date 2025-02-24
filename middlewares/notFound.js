const notFound = (req, res) => {
  return res.status(404).json({
    error: "Not found",
    message: "La rotta non è stata trovata",
  });
};

module.exports = notFound;
