const express = require("express");

const usersController = require("../../modules/auth/controller");
const { validateData, auth, validateSubscription } = require("../../modules/auth/middleware");

const router = express.Router();

router.post("/signup", validateData, usersController.signup);

router.post("/login", validateData, usersController.login);

router.get("/logout", auth, usersController.logout);

router.get("/current", auth, usersController.current);

router.patch("/", validateSubscription, auth, usersController.changeSubscription);

module.exports = router;
