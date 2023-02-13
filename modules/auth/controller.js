const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs").promises;
const Jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");
const sgMail = require("@sendgrid/mail");
const usersService = require("./service");
require("dotenv").config();

const secretKey = process.env.JTW_SECRET;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const signup = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const avatarURL = gravatar.url(email);
    const verificationToken = uuidv4();

    const user = await usersService.create({
      password: hash,
      email,
      avatarURL,
      verificationToken,
    });

    const msg = {
      to: email,
      from: "domi.sosnowska@o2.pl",
      subject: "Verify email",
      text: `To verify email copy the following link and open in browser: http://localhost:3000/api/users/verify/${verificationToken}`,
      html: `<p>Verify email by clicking <a href="http://localhost:3000/api/users/verify/${verificationToken}">here</a></p>`,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });

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
  const user = await usersService.getByKey({ email });

  if (!(user && bcrypt.compareSync(password, user.password))) {
    return res.status(401).json({
      message: "Email or password is wrong",
    });
  }

  if (!user.verify) {
    return res.status(401).json({
      message: "Verify email to log in",
    });
  }

  const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "1h" });
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

const changeSubscription = async (req, res, next) => {
  const user = await usersService.getById(req.user.id);
  const { subscription } = req.body;

  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const updatedUser = await usersService.update(user.id, { subscription });
  return res
    .status(200)
    .json({ email: updatedUser.email, subscription: updatedUser.subscription });
};

const verifyUser = async (req, res, next) => {
  const verificationToken = req.params.verificationToken;
  const user = await usersService.getByKey({ verificationToken });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await usersService.update(user.id, { verificationToken: null, verify: true });

  return res.status(200).json({
    message: "Verification successful",
  });
};

const verificationBackup = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "missing required field email" });
  }

  const user = await usersService.getByKey({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (user.verify) {
    return res
      .status(400)
      .json({ message: "Verification has already been passed" });
  }

  const msg = {
    to: email,
    from: "domi.sosnowska@o2.pl",
    subject: "Verify email",
    text: `To verify email copy the following link and open in browser: http://localhost:3000/api/users/verify/${user.verificationToken}`,
    html: `<p>Verify email by clicking <a href="http://localhost:3000/api/users/verify/${user.verificationToken}">here</a></p>`,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });

  return res.status(200).json({ message: "Verification email sent" });
};

const storeImage = path.join(process.cwd(), "public", "avatars");

const updateAvatar = async (req, res, next) => {
  const user = await usersService.getById(req.user.id);

  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const { path: temporaryName, originalname } = req.file;
  const fileName = path.join(storeImage, user.id + originalname);

  try {
    const file = await Jimp.read(temporaryName);
    file.resize(250, 250).write(temporaryName);
  } catch (err) {
    console.error({ message: err });
  }

  try {
    await fs.rename(temporaryName, fileName);
  } catch (err) {
    await fs.unlink(temporaryName);
    return next(err);
  }

  const updatedUser = await usersService.update(user.id, {
    avatarURL: `/avatars/${user.id + originalname}`,
  });

  return res.status(200).json({ avatarURL: updatedUser.avatarURL });
};

module.exports = {
  signup,
  login,
  logout,
  current,
  changeSubscription,
  updateAvatar,
  verifyUser,
  verificationBackup,
};
