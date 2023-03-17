const express = require("express");

const contactsController = require("../../modules/contacts/controller");
const validateData = require("../../modules/contacts/middleware")
const {auth} = require("../../modules/auth/middleware")

const router = express.Router();

router.get("/", auth, contactsController.listContacts);

router.get("/:contactId", auth, contactsController.getContactById);

router.post("/", auth, validateData, contactsController.addContact);

router.put("/:contactId", auth, validateData, contactsController.updateContact);

router.delete("/:contactId", auth, contactsController.removeContact);

router.patch("/:contactId/favorite", auth, validateData, contactsController.updateStatusContact)

module.exports = router;