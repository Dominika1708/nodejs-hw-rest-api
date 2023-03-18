const Contact = require("./model");

const getAll = async (id) => Contact.find({ owner: id });

const getById = async (id) => Contact.findById(id);

const create = async (body) => Contact.create(body);

const remove = async (id) => Contact.findByIdAndRemove(id);

const update = async (id, body) => Contact.findByIdAndUpdate(id, body, { new: true });

module.exports = {
  getAll,
  getById,
  create,
  remove,
  update,
};
