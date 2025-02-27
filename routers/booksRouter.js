const express = require("express");
const multer = require("multer");
const router = express.Router();
const bookController = require("../controllers/bookController");

const storage = multer.diskStorage({
  destination: "public/books",
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });
// La lista delle rotte con la funzione corrispondente del controller

// Index
router.get("/", bookController.index);

// Show
router.get("/:id", bookController.show);

// Store Review
router.post("/:id/reviews", bookController.storeReview);

// Store
router.post("/", upload.single("image"), bookController.store);

// Destroy
router.delete("/:id", bookController.destroy);

module.exports = router;
