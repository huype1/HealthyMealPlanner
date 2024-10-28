const jwt = require('jsonwebtoken')
const { SECRET } = require('./config.js');
const User = require("../models/user.js");
const Session = require("../models/session.js");
const UserAllergy = require("../models/user_allergies.js");
const logger = require("./logger");
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);
  logger.info(request.body)
  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "invalid token" });
  } else if (error.name === "SequelizeDatabaseError") {
    return response.status(500).json({ error: error.message });
  } else if (error.name === "TypeError") {
    return response.status(500).json({ error: error.message });
  } else if (error.name === "SequelizeValidationError") {
    return response.status(500).json({ error: error.message });
  }

  console.log(error);
  next(error);
};

//middleware
const userFinder = async (req, res, next) => {
  req.user = await User.findByPk(req.params.id, {
    include: [
      {
        model: UserAllergy,
        attributes: ["allergy"],
      },
    ],
  });
  next();
};


// const tokenExtractor = (req, res, next) => {
//   const authorization = req.get('Authorization')
//   if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//     try {
//       req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
//     } catch{
//       return res.status(401).json({ error: 'token invalid' })
//     }
//   } else {
//     return res.status(401).json({ error: 'token missing' })
//   }
//   next()
// }
const tokenValidate = async (req, res, next) => {
  const authorization = await req.get('Authorization');
  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Token missing' });
  }

  const token = authorization.substring(7);
  try {
    req.decodedToken = jwt.verify(token, SECRET);
    const session = await Session.findOne({where: {
    token: token.trim()
  }});
    if (!session) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.session = session;
    next();
  } catch (error) {
    console.log(error);
    await Session.destroy({ where: { token } });
    return res.status(401).json({ error: 'Error when validating token' });
  }
};

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (user.status !== "admin") {
    return res.status(401).json({ error: 'operation not permitted' })
  }
  next()
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  userFinder,
  tokenValidate,
  isAdmin
};
