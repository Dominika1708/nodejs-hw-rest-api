const User = require("./model");

const getById = async (id) => User.findById(id);

const getByKey = async (key) => User.findOne(key);

const create = async (body) => User.create(body);

const update = async (id, body) =>  User.findByIdAndUpdate(id, body, { new: true });

module.exports = {
  getById,
  getByKey,
  create,
  update,
};
