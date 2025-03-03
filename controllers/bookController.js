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

// Store Review
const storeReview = (req, res) => {
  // Recuperiamo l'id dalla rotta
  const { id } = req.params;

  // Recuperiamo il body della richiesta
  const { name, vote, text } = req.body;

  // Preparare la query di inserimento
  const sql =
    "INSERT INTO reviews (book_id, name, text, vote) VALUES (?, ?, ?, ?)";
  // Eseguire la query
  connection.execute(sql, [id, name, text, vote], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Query Error",
        message: `Database query failed: ${sql}`,
      });
    }
    // restituire la risposta al client
    res.status(201).json({ id: results.insertId });
  });
};

// Store
const store = (req, res) => {
  // Recupero il nome dell'immagine caricata
  const image = req.file.filename;

  // Recuperiamo il body della richiesta
  const { title, author, abstract } = req.body;

  // Preparare la query di inserimento
  const sql =
    "INSERT INTO books (title, author, abstract, image) VALUES (?, ?, ?, ?)";
  // Eseguire la query
  connection.execute(sql, [title, author, abstract, image], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Query Error",
        message: `Database query failed: ${sql}`,
      });
    }
    // restituire la risposta al client
    res.status(201).json({ id: results.insertId });
  });
};

// Destroy
const destroy = (req, res) => {};

module.exports = { index, show, storeReview, store, destroy };
