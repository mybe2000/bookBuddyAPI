const client = require("./client");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;

const createUser = async ({ firstname, lastname, email, password }) => {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    console.log(hashedPassword);
    const SQL = `INSERT INTO users(firstname, lastname, email, password) VALUES($1, $2, $3, $4) ON CONFLICT(email) DO NOTHING RETURNING id, firstname, lastname, email`;

    const {
      rows: [user],
    } = await client.query(SQL, [
      firstname || "fistname",
      lastname || "lastname",
      email,
      hashedPassword,
    ]);
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

const getUsers = async () => {
  try {
    const SQL = `SELECT * FROM users`;
    const { rows } = await client.query(SQL);
    return rows;
  } catch (error) {
    console.log(error);
  }
};

const getUser = async ({ email, password }) => {
  try {
    const existingUser = await getUserByEmail(email);
    if (!existingUser) return;
    const hashedPassword = existingUser.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    if (!passwordsMatch) return;
    delete existingUser.password;
    return existingUser;
  } catch (error) {
    console.log(error);
  }
};

const getUserById = async (id) => {
  try {
    const SQL = `SELECT * FROM users WHERE id=$1`;
    const {
      rows: [user],
    } = await client.query(SQL, [id]);
    return user;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createUser, getUserByEmail, getUsers, getUserById };
