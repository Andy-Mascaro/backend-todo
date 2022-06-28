const pool = require('../utils/pool');

module.exports = class Todo {
  id;
  description;
  client_id;
  completed;

  constructor(row) {
    this.id = row.id;
    this.description = row.description;
    this.client_id = row.client_id;
    this.completed = row.completed;
  }

  static async insert({ description, client_id }) {
    const { rows } = await pool.query(
      `INSERT INTO todos (description, client_id) VALUES ($1, $2) RETURNING *`,
      [description, client_id]
    );
    return new Todo(rows[0]);
  }

  static async getById(id) {
    const { rows } = await pool.query(`SELECT * FROM todos WHERE id=$1`, [id]);
    if (!rows[0]) {
      return null;
    }
    return new Todo(rows[0]);
  }
};
