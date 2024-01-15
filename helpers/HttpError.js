const messageErrorList = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not found",
    409: "Conflict",
  };
  
  const HttpError = (statusError, message = messageErrorList[statusError]) => {
    const error = new Error(message);
    error.status = statusError;
    return error;
  };
  
  export default HttpError;