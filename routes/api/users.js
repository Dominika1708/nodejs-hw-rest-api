const express = require("express");

const usersController = require("../../modules/auth/controller");
const { validateSignup, validateLogin, auth, validateSubscription, upload } = require("../../modules/auth/middleware");

const router = express.Router();

router.get("/current", auth, usersController.current);

router.get("/verify/:verificationToken", usersController.verifyUser);

router.post("/signup", validateSignup, usersController.signup);

router.post("/login", validateLogin, usersController.login);

router.post("/logout", auth, usersController.logout);

router.post("/verify", usersController.verificationBackup)

router.patch("/", validateSubscription, auth, usersController.changeSubscription);

router.patch("/avatars", auth, upload.single('avatar'), usersController.updateAvatar)

module.exports = router;
