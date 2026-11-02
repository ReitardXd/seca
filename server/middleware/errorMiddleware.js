const notFound = (req, res) => {
  res.status(404).json({ message: `Not found - ${req.originalUrl}` })
}

const errorHandler = (err, req, res, next) => {
  const status =
    err.status || err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500)

  console.error(`[${req.method} ${req.originalUrl}]`, err)

  res.status(status).json({
    message: err.message || 'Server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  })
}

module.exports = { notFound, errorHandler }
