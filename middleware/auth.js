const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];

  if (!token) {
    const response = {
      message: "A token is required for authentication",
      isSuccess: false,
      data: null,
    };

    return res.status(403).send(response);
  }

  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    const responseInvalid = {
      message: "Invalid Token",
      isSuccess: false,
      data: null,
    };

    return res.status(401).send(responseInvalid);
  }
  return next();
};

module.exports = verifyToken;
