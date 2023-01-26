const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usersService = require("./service");
require("dotenv").config();

const secretKey = process.env.JTW_SECRET;

const signup = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const user = await usersService.create({ password: hash, email });
    return res
      .status(201)
      .json({ user: { email: user.email, subscription: user.subscription } });
  } catch {
    return res.status(409).json({
      message: "Email in use",
    });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await usersService.getByEmail(email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({
      message: "Email or password is wrong",
    });
  }

  const payload = {
    id: user.id,
    password: user.password,
    email,
    subscription: user.subscription,
  };

  const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
  const userWithToken = await usersService.update(user._id, { token });
  return res
    .status(200)
    .json({ token, user: { email, subscription: userWithToken.subscription } });
};

const logout = async (req, res, next) => {
  const user = await usersService.getById(req.user.id);

  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
  }
  const update = await usersService.update(user.id, { token: null });
  return res.sendStatus(204);
};

const current = async (req, res, next) => {
  const user = await usersService.getById(req.user.id);

  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
  }
  return res
    .status(200)
    .json({ email: user.email, subscription: user.subscription });
};

module.exports = {
  signup,
  login,
  logout,
  current,
};
