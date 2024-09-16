const client = require("./client");

const createReservation = async ({ userId, booksId }) => {
  try {
    const SQL = `INSERT INTO reservations(userid, booksid) VALUES($1, $2) RETURNING *`;
    const {
      rows: [result],
    } = await client.query(SQL, [userId, booksId]);
    console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
};

const getReservation = async (id) => {
  try {
    const SQL = `SELECT * FROM reservations WHERE id=$1`;
    const {
      rows: [result],
    } = await client.query(SQL, [id]);
    return result;
  } catch (error) {
    throw error;
  }
};

const getUsersReservations = async (userId) => {
  try {
    // const SQL = `SELECT reservations.id, books.id, books.title, books.description, books.coverimage, books.author FROM reservations JOIN books ON reservations.booksid = books.id AND userid=$1`;
    const SQL = `SELECT reservations.id, books.id, books.title, books.description, books.coverimage, books.author FROM reservations JOIN books ON userid=$1 AND reservations.booksid= books.id`;
    const { rows } = await client.query(SQL, [userId]);
    if (!rows) return;
    console.log(rows);
    return rows;
  } catch (error) {
    throw error;
  }
};

const deleteReservation = async (id) => {
  try {
    const SQL = `DELETE FROM reservations WHERE id=$1`;
    const {
      rows: [result],
    } = await client.query(SQL, [id]);
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createReservation,
  getReservation,
  deleteReservation,
  getUsersReservations,
};
