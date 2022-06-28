const bcrypt = require('bcrypt');
const Client = require('../models/Client');
const jwt = require('jsonwebtoken');
module.exports = class ClientService {
  static async create({ email, password }) {
    if (email.length <= 6) {
      throw new Error('Invalid email');
    }

    if (password.length < 6) {
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

  static async signIn({ email, password = '' }) {
    try {
      const client = await Client.getByEmail(email);
      if (!client) throw new Error('Invalid email');
      if (!bcrypt.compareSync(password, client.passwordHash))
        throw new Error('Invalid password');
      const token = jwt.sign({ ...client }, process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });
      return token;
    } catch (error) {
      error.status = 401;
      throw error;
    }
  }
};
