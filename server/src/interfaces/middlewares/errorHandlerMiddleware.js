const errorHandlerMiddleware = (err, req, res, next) => {
  console.log("this is from middleware ; ", req, err);
  res.status(err.status || 500).json({ error: err.message });
};

module.exports = errorHandlerMiddleware;
