const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

// La lista delle rotte con la funzione corrispondente del controller

// Index
router.get("/", bookController.index);

// Show
router.get("/:id", bookController.show);

// Store Review
router.post("/:id/reviews", bookController.storeReview);

// Destroy
router.delete("/:id", bookController.destroy);

module.exports = router;
