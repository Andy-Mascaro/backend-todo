const bcrypt = require('bcrypt');
const Client = require('../models/Client');

module.exports = class ClientService {
  static async create({ email, password }) {
    if (email.length <= 6) {
      throw new Error('Password must be at minimum 6 characters long');
    }
    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );
    const client = await Client.insert({
      email,
      passwordHash,
    });

    return client;
  }
};
