const express = require("express");
const cors = require("cors");
const notFound = require("./middlewares/notFound");
const errorsHandler = require("./middlewares/errorsHandler");
const booksRouter = require("./routers/booksRouter");

const app = express();
const { PORT, FE_URL } = process.env;

// middleware per il parsing del req.body
app.use(express.json());
// middleware CORS (che permette la comunicazione con il FE)
app.use(
  cors({
    origin: FE_URL,
  })
);
// middleware per i file statici
app.use(express.static("public"));

// Routes (le rotte della mia applicazione)
app.use("/books", booksRouter);

// Middlewares - Per la gestione degli errori (404, 500)
app.use(notFound);
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
