const client = require("./client");

const getBooks = async () => {
  try {
    const SQL = `SELECT * FROM books`;
    const { rows } = await client.query(SQL);
    console.log(rows);
    if (!rows) {
      return { message: "something went wrong" };
    }
    return rows;
  } catch (error) {
    console.log(error);
  }
};

const getBook = async (id) => {
  try {
    const SQL = `SELECT * FROM books WHERE id=$1`;
    const {
      rows: [book],
    } = await client.query(SQL, [id]);
    return book;
  } catch (error) {
    console.log(error);
  }
};

const deleteBook = async (id) => {
  try {
    const SQL = `DELETE FROM books WHERE id=$1 RETURNING *`;
    const {
      rows: [result],
    } = await client.query(SQL, [id]);

    return result;
  } catch (error) {
    console.log(error);
  }
};

const updateBook = async (id, available) => {
  try {
    const SQL = `UPDATE books SET available=$1 WHERE id=$2 RETURNING *`;
    const {
      rows: [book],
    } = await client.query(SQL, [available, id]);
    return book;
  } catch (error) {
    console.log(error);
  }
};

const createBook = async ({
  title,
  author,
  description,
  coverImage,
  available,
}) => {
  try {
    const SQL = `INSERT INTO books(title, author, description, coverImage, available) VALUES($1, $2, $3, $4, $5) RETURNING *`;
    const {
      rows: [book],
    } = await client.query(SQL, [
      title,
      author,
      description,
      coverImage,
      available || true,
    ]);
    // console.log(book);
    return book;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createBook, getBooks, getBook, deleteBook, updateBook };
