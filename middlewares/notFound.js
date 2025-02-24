const notFound = (req, res) => {
  return res.status(404).json({
    error: "Not found",
    message: "Pagina non trovata",
  });
};

module.exports = notFound;
