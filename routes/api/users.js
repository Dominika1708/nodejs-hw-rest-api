const express = require("express");

const usersController = require("../../modules/auth/controller");
const { validateData, auth, upload } = require("../../modules/auth/middleware");
const schema = require("../../modules/auth/schema");

const router = express.Router();

router.get("/current", auth, usersController.current);

router.post("/signup", validateData(schema.signup), usersController.signup);

router.post("/login", validateData(schema.login), usersController.login);

router.post("/logout", auth, usersController.logout);

router.post(
  "/verify",
  validateData(schema.verify),
  usersController.verificationBackup
);

router.patch("/verify/:verificationToken", usersController.verifyUser);

router.patch(
  "/",
  validateData(schema.subscription),
  auth,
  usersController.changeSubscription
);

router.patch(
  "/avatar",
  auth,
  upload.single("avatar"),
  usersController.updateAvatar
);

module.exports = router;
