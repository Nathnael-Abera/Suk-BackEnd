//catch Async error
module.exports = (someAsyncCall) => (req, res, next) => {
  Promise.resolve(someAsyncCall(req, res, next)).catch(next);
};
