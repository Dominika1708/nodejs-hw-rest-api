const fs = require("fs/promises");
const path = require("path");

const contactsPath = path.join("models", "contacts.json");

const listContacts = async () => {
  const response = await fs.readFile(contactsPath);
  return JSON.parse(response.toString());
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  return contacts.find((contact) => contact.id === contactId);
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const newContacts = contacts.filter((contact) => contact.id !== contactId);
  fs.writeFile(contactsPath, JSON.stringify(newContacts));
};

const addContact = async (body) => {
  const contacts = await listContacts();
  const newContacts = [...contacts, body];
  fs.writeFile(contactsPath, JSON.stringify(newContacts));
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const updatedContacts = contacts.map((contact) =>
    contact.id === contactId ? (contact = { ...contact, ...body }) : contact
  );
  fs.writeFile(contactsPath, JSON.stringify(updatedContacts));
  return updatedContacts.find((contact) => contact.id === contactId);
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
