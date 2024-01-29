import { HttpError } from "../helpers/index.js";

const validateAvatar = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.file, { abortEarly: false });
    if (error) {
      return next(HttpError(400, error.message));
    }
    next();
  };

  return func;
};

export default validateAvatar;
