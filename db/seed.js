require("dotenv").config();

const client = require("./client");
const { createUser, getUserByEmail } = require("./users");

const { createBook } = require("./books");

const users = [
  {
    firstname: "Alice",
    lastname: "Johnson",
    email: "alice@example.com",
    password: "alice123",
  },
  {
    firstname: "Bob",
    lastname: "Smith",
    email: "bob@example.com",
    password: "bob456",
  },
  {
    firstname: "Charlie",
    lastname: "Brown",
    email: "charlie@example.com",
    password: "charlie789",
  },
];

const books = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description:
      'Set in the 1920s, "The Great Gatsby" is a novel that vividly depicts the extravagance and decadence of the Jazz Age in America. It explores the life of Jay Gatsby, a mysterious millionaire, and his unrequited love for Daisy Buchanan. Through the lens of Nick Carraway, the story delves into themes of wealth, ambition, illusion, and the elusive American Dream.',
    coverImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg/440px-The_Great_Gatsby_Cover_1925_Retouched.jpg",
    available: false,
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description:
      'Harper Lee’s masterpiece, "To Kill a Mockingbird," is a poignant exploration of racial prejudice and moral growth in the American South during the 1930s. The novel follows Scout Finch, her brother Jem, and their father Atticus as they navigate the complexities of a racially divided society. Through the lens of a child’s innocence, it addresses themes of injustice, empathy, and the power of compassion.',
    coverImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg/440px-To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg",
    available: false,
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description:
      'Jane Austen’s "Pride and Prejudice" is a timeless tale of love, class, and societal expectations in early 19th-century England. It revolves around the headstrong Elizabeth Bennet and the enigmatic Mr. Darcy, whose initial pride and prejudice lead to misunderstandings and complications. This classic novel explores themes of manners, marriage, and the complexities of human relationships.',
    coverImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/PrideAndPrejudiceTitlePage.jpg/440px-PrideAndPrejudiceTitlePage.jpg",
    available: true,
  },
  {
    title: "1984",
    author: "George Orwell",
    description:
      'George Orwell’s dystopian masterpiece, "1984," presents a chilling vision of a totalitarian society ruled by the Party and its omnipresent leader, Big Brother. The novel follows Winston Smith, a citizen of Airstrip One, as he navigates a world of surveillance, propaganda, and thought control. "1984" serves as a stark warning about the erosion of individuality, truth, and freedom in a surveillance state.',
    coverImage:
      "https://images.pexels.com/photos/7034646/pexels-photo-7034646.jpeg",
    available: true,
  },
];

const dropTables = async () => {
  try {
    await client.query("DROP TABLE IF EXISTS users");
    // write another DROP TABLE query and run it here for books table
    await client.query("DROP TABLE IF EXISTS books");
  } catch (error) {
    console.log(error);
  }
};

const createTables = async () => {
  try {
    await client.query(`CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        firstname VARCHAR(64),
        lastname VARCHAR(64),
        email VARCHAR(64) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
        )`);

    await client.query(`CREATE TABLE books(
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(127) NOT NULL,
        description VARCHAR(1023),
        coverimage VARCHAR(255) DEFAULT 'https://images.pexels.com/photos/7034646/pexels-photo-7034646.jpeg',
        available boolean DEFAULT true
        )`);
  } catch (error) {
    console.log(error);
  }
};

const insertUsers = async () => {
  try {
    for (const user of users) {
      await createUser(user);
    }
  } catch (error) {
    console.log(error);
  }
};

const insertBooks = async () => {
  try {
    for (const book of books) {
      await createBook(book);
    }
  } catch (err) {
    console.log(err);
  }
};

const seedDatabase = async () => {
  try {
    client.connect();
    console.log("dropping tables");
    await dropTables();
    console.log("dropped");
    console.log("CREATING TABLES...");
    await createTables();

    console.log("TABLES SUCCESSFULLY CREATED!");

    console.log("inserting users");
    await insertUsers();
    console.log("users added successfully");
    await getUserByEmail("alice@example.com");
    // await createBook({
    //   title: "Alexander and the Terrible, Horrible, No Good, Very Bad Day",
    //   author: "Judith Viorst",
    //   description:
    //     "Alexander and the Terrible, Horrible, No Good, Very Bad Day is a children's picture book by American author Judith Viorst. It was first published in 1972 and tells the story of Alexander, a boy who has a terrible day from start to finish. The book is a humorous look at the everyday frustrations of childhood.",
    //   coverImage:
    //     "https://upload.wikimedia.org/wikipedia/en/2/25/ALEXANDER_TERRIBLE_HORRIBLE.jpg",
    //   available: true,
    // });
    console.log("inserting books");
    await insertBooks();
    console.log("books added successfully");
  } catch (error) {
    console.log(error);
  } finally {
    client.end();
  }
};

seedDatabase();
