export const handleSaveError = (err, data, next) => {
    const { name, code } = err;
    err.status = name === "MongoServerError" && code === 1100 ? 409 : 400;
    next();
  };
  
  export const handleUpdateReturnData = function (next) {
    this.options.new = true;
    this.options.runValidators = true;
    next();
  };