import createHttpError from 'http-errors'

const hostOnly = (req, res, next) => {
  if (req.user.role === 'guest') {
    next(createHttpError(403, 'You must be a host to gain access!'))
  } else {
    next()
  }
}
export default hostOnly
