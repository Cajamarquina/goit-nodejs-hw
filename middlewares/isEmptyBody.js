import { HttpError } from "../helpers/index.js";

const isEmptyBody = (errorMessage) => (req, res, next) => {
  const { length } = Object.keys(req.body);
  if (!length) {
    return next(HttpError(400, errorMessage));
  }
  next();
};

export default isEmptyBody;