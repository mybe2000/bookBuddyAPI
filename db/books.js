/*TODO

1. Create a function createBook({ title,
  author,
  description,
  coverImage,
  available,})
  to insert into the 'books' table in our db - this is JUST LIKE the createUser function

  
2. export the function from this file


  */
const client = require("./client");

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
      available,
    ]);
    console.log(book);
    return book;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createBook };
