const User = require("./model");

const create = async (body) => User.create(body);

const getByEmail = async (email) => User.findOne({email});

const update = async (id, body) => User.findByIdAndUpdate(id, body, { new: true });

const getById = async (id) => User.findById(id);

module.exports = {
    create,
    getByEmail,
    update,
    getById
}