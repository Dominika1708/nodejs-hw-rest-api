const { isValidObjectId } = require("mongoose");
const contactsService = require("./service");

const listContacts = async (req, res, next) => {
  const contacts = await contactsService.getAll(req.user.id);
  const { page, limit, favorite } = req.query;
  let filteredContacts = [];

  if (favorite) {
    filteredContacts = contacts.filter(
      ({ favorite: fav }) => fav === Boolean(favorite)
    );
  }
  if (page && limit) {
    filteredContacts = contacts.slice(limit * (page - 1), limit * page);
  }
  if (!(page || limit || favorite)) {
    filteredContacts = [...contacts];
  }

  return res.status(200).json({contacts: filteredContacts});
};

const getContactById = async (req, res, next) => {
  const id = req.params.contactId;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      message:
        "Bad Request. Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer",
    });
  }

  const contact = await contactsService.getById(id);
  
  if (contact.owner !== req.user.id) {
    return res.status(401).json({ message: "Not authorized" });
  }

  return contact
    ? res.status(200).json(contact)
    : res.status(404).json({ message: "Not found" });
};

const addContact = async (req, res, next) => {
  const owner = req.user.id;
  const { name, email, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: "missing required name field" });
  }

  const contact = await contactsService.create({ name, email, phone, owner });

  return res.status(201).json({contact});
};

const removeContact = async (req, res, next) => {
  const id = req.params.contactId;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      message:
        "Bad Request. Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer",
    });
  }

  const contact = await contactsService.getById(id);

  if (!contact) return res.status(404).json({ message: "Not found" });

  if (contact.owner !== req.user.id) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const deletedTask = await contactsService.remove(id);
  return res.status(200).json({ message: "contact deleted" });
};

const updateContact = async (req, res, next) => {
  const id = req.params.contactId;
  const { name, email, phone } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      message:
        "Bad Request. Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer",
    });
  }
  
  if (!name && !email && !phone) {
    return res.status(400).json({ message: "missing fields" });
  }

  const contact = await contactsService.getById(id);

  if (!contact) return res.status(404).json({ message: "Not found" });

  if (contact.owner !== req.user.id) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const updatedContact = await contactsService.update(id, {
    name,
    email,
    phone,
  });
  return res.status(200).json({ contact: updatedContact });
};

const updateStatusContact = async (req, res, next) => {
  const id = req.params.contactId;
  const { favorite } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      message:
        "Bad Request. Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer",
    });
  }
  
  if (!favorite) {
    return res.status(400).json({ message: "missing field favorite" });
  }

  const contact = await contactsService.getById(id);

  if (!contact) return res.status(404).json({ message: "Not found" });

  if (contact.owner !== req.user.id) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const updatedContact = await contactsService.update(id, { favorite });
  return res.status(200).json({ contact: updatedContact });
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
