const { isValidObjectId } = require("mongoose");
const Joi = require("joi");
const contactsService = require("./service");

const schema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  phone: Joi.string(),
});

const listContacts = async (req, res, next) => {
  const contacts = await contactsService.getAll();
  return res.status(200).json(contacts);
};

const getContactById = async (req, res, next) => {
  const id = req.params.contactId;
  if (!isValidObjectId(id))
    return res.status(400).json({
      message:
        "Bad Request. Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer",
    });

  const contact = await contactsService.getById(id);
  return contact
    ? res.status(200).json(contact)
    : res.status(404).json({ message: "Not found" });
};

const addContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  schema.validate(req.body);

  if (!name || !email || !phone)
    return res.status(400).json({ message: "missing required name field" });

  const contact = await contactsService.create({ name, email, phone });

  return res.status(201).json(contact);
};

const removeContact = async (req, res, next) => {
  const id = req.params.contactId;
  if (!isValidObjectId(id))
    return res.status(400).json({
      message:
        "Bad Request. Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer",
    });

  const exists = await contactsService.exists(id);

  if (!exists) return res.status(404).json({ message: "Not found" });

  const deletedTask = await contactsService.remove(id);
  return res.status(200).json({ message: "contact deleted", deletedTask });
};

const updateContact = async (req, res, next) => {
  const id = req.params.contactId;
  const { name, email, phone } = req.body;
  schema.validate(req.body);

  if (!isValidObjectId(id))
    return res.status(400).json({
      message:
        "Bad Request. Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer",
    });

  const exists = await contactsService.exists(id);

  if (!exists) return res.status(404).json({ message: "Not found" });
  if (!name && !email && !phone)
    return res.status(400).json({ message: "missing fields" });

  const updatedContact = await contactsService.update(id, {
    name,
    email,
    phone,
  });
  return res.status(200).json({ updatedContact });
};

const updateStatusContact = async (req, res, next) => {
  const id = req.params.contactId;
  const { favorite } = req.body;

  if (!isValidObjectId(id))
    return res.status(400).json({
      message:
        "Bad Request. Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer",
    });

  const exists = await contactsService.exists(id);

  if (!exists) return res.status(404).json({ message: "Not found" });
  if (!favorite)
    return res.status(400).json({ message: "missing field favorite" });

  const updatedContact = await contactsService.update(id, { favorite });
  return res.status(200).json({ updatedContact });
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
