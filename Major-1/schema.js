const Joi = require("joi");

const loginSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(3).required(),
});

const registrationSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(), 
  email: Joi.string().email().required(),
  password: Joi.string().min(3).required(),
});

const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  loginSchema
    .validateAsync({ username, password })
    .then(() => next())
    .catch(() => res.redirect("/login"));
};

const validateRegistration = (req, res, next) => {
  const { username, email, password } = req.body;
  registrationSchema
    .validateAsync({ username, email, password })
    .then(() => next())
    .catch(() => res.redirect("/register"));
};

module.exports = { validateLogin, validateRegistration };
