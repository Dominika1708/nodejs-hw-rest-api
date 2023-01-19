const express = require("express");

const contactsController = require("../../modules/controller");

const router = express.Router();

router.get("/", contactsController.listContacts);

router.get("/:contactId", contactsController.getContactById);

router.post("/", contactsController.addContact);

router.delete("/:contactId", contactsController.removeContact);

router.put("/:contactId", contactsController.updateContact);

router.patch("/:contactId/favorite", contactsController.updateStatusContact)

module.exports = router;