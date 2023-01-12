const express = require("express");
const Joi = require('joi');
const shortid = require("shortid");

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  return res.status(200).json( contacts );
});

router.get("/:contactId", async (req, res, next) => {
  const id = req.params.contactId;
  const contact = await getContactById(id);
  return contact
    ? res.status(200).json( contact )
    : res.status(404).json({ message: "Not found" });
});

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone)
    return res.status(400).json({ message: "missing required name field" });

  const id = shortid.generate();
  const contact = { id, name, email, phone };
  await addContact(contact);
  return res.status(201).json( contact );
});

router.delete("/:contactId", async (req, res, next) => {
  const id = req.params.contactId;
  const isIdValid = await getContactById(id);

  if (!isIdValid) return res.status(404).json({ message: "Not found" });

  await removeContact(id);
  return res.status(200).json({ message: "contact deleted" });
});

router.put("/:contactId", async (req, res, next) => {
  const id = req.params.contactId;
  const taskToEdit = await getContactById(id);
  const {name, email, phone} = req.body;

  if (!taskToEdit) return res.status(404).json({ message: "Not found" });
  if (!name && !email && !phone) return res.status(400).json({ message: "missing fields" });

  const newContact = await updateContact(id, req.body);
  return res.status(200).json( newContact );
});

module.exports = router;
