const User = require("./model");

const getById = async (id) => User.findById(id);

const getByEmail = async (email) => User.findOne({email});

const create = async (body) => User.create(body);

const update = async (id, body) =>  User.findByIdAndUpdate(id, body, { new: true });

module.exports = {
  getById,
  getByEmail,
  create,
  update,
};
