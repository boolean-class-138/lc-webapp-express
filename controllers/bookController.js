// Recupero la connessione al database
const connection = require("../data/db");

// Index
const index = (req, res) => {
  // const sql = "SELECT * FROM books";

  // BONUS: query con media voto per ogni libro
  const sql = `
  SELECT books.*, ROUND(AVG(reviews.vote)) as avg_vote
  FROM books
  LEFT JOIN reviews ON books.id = reviews.book_id
  GROUP BY books.id`;

  // lancio la query
  connection.execute(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Query Error",
        message: `Database query failed: ${sql}`,
      });
    }

    const books = results.map((book) => {
      book.image = `${process.env.BE_URL}/books/${book.image}`;
      return book;
    });

    res.json(books);
  });
};

// Show
const show = (req, res) => {
  // Recuperiamo l'id dalla rotta
  const { id } = req.params;

  // const bookSql = `
  //   SELECT *
  //   FROM books
  //   WHERE id = ?`;

  const bookSql = `
  SELECT books.*, ROUND(AVG(reviews.vote)) as avg_vote
  FROM books
  LEFT JOIN reviews ON books.id = reviews.book_id
  WHERE books.id = ?
  GROUP BY books.id`;

  // lancio la query preparata per leggere il libro con id ?
  connection.execute(bookSql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Query Error",
        message: `Database query failed: ${bookSql}`,
      });
    }

    // Recupero il libro dall'array dei risultati
    const book = results[0];

    if (!book) {
      return res.status(404).json({
        error: "Not found",
        message: "Book not found",
      });
    }

    // Modifico la proprietà image aggiungendo l'url completa
    book.image = `${process.env.BE_URL}/books/${book.image}`;

    // query per recuperare le recensioni di quel libro
    const reviewsSql = `
    SELECT * 
    FROM reviews
    WHERE book_id = ?`;

    connection.execute(reviewsSql, [id], (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "Query Error",
          message: `Database query failed: ${reviewsSql}`,
        });
      }

      // aggiungo la chiave reviews
      book.reviews = results;
      res.json(book);
    });
  });
};

// Destroy
const destroy = (req, res) => {};

module.exports = { index, show, destroy };
