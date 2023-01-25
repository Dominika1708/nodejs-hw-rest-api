const Joi = require("joi");
const passport = require("passport");
const User = require("./model");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
require("dotenv").config();

const secret = process.env.JTW_SECRET;

const schema = Joi.object({
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required(),
  subscription: Joi.string().valid("starter", "pro", "business"),
});

const validateData = (req, res, next) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  req.body = value;
  next();
};

const params = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret,
};

passport.use(
  new JwtStrategy(params, (payload, done) => {
    User.findById(payload.id , (err, user) => {
      if (err) return done(err, false);
      if (user) return done(null, user);
      return done(null, false);
    });
    //   .then(([user]) => {
    //     !user ? done(new Error("User not found")) : done(null, user);
    //   })
    //   .catch(done);
  })
);

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (!user || error) {
      return res.status(401).json({ message: "Not authorized on auth" });
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = { validateData, auth };
