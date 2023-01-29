const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email({
    minDomainSegments: 2,
  }),
  phone: Joi.string(),
  favorite: Joi.boolean(),
});

const validateData = (req, res, next) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  req.body = value;
  next();
};

module.exports = validateData;
