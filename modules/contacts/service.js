const Contact = require("./model");

const getAll = async () => Contact.find();

const getById = async (id) => Contact.findById(id);

const create = async (body) => Contact.create(body);

const exists = async (id) => Contact.exists({ _id: id });

const remove = async (id) => Contact.findByIdAndRemove(id);

const update = async (id, body) => Contact.findByIdAndUpdate(id, body, {new: true});

module.exports = {
  getAll,
  getById,
  create,
  exists,
  remove,
  update,
};
