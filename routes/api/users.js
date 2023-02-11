const express = require("express");

const usersController = require("../../modules/auth/controller");
const { validateData, auth, validateSubscription } = require("../../modules/auth/middleware");

const router = express.Router();

router.get("/current", auth, usersController.current);

router.get("/logout", auth, usersController.logout);

router.get("/verify/:verificationToken", usersController.verifyUser);

router.post("/signup", validateData, usersController.signup);

router.post("/login", validateData, usersController.login);

router.post("/verify", usersController.verificationBackup)

router.patch("/", validateSubscription, auth, usersController.changeSubscription);

module.exports = router;
