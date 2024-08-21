const client = require("./client");

const createUser = async ({ firstname, lastname, email, password }) => {
  console.log("created", firstname);
  try {
    const SQL = `INSERT INTO users(firstname, lastname, email, password) VALUES($1, $2, $3, $4) ON CONFLICT(email) DO NOTHING RETURNING id, firstname, lastname, email`;

    const {
      rows: [user],
    } = await client.query(SQL, [firstname, lastname, email, password]);
    console.log("rows", user);
    return user;
  } catch (error) {
    console.log(error);
  }
};

const getUserByEmail = async (email) => {
  try {
    const SQL = `SELECT * FROM users WHERE email=$1`;
    const {
      rows: [result],
    } = await client.query(SQL, [email]);
    console.log(result);
    return result;
  } catch (error) {}
};

module.exports = { createUser, getUserByEmail };
