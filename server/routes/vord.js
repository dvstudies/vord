const express = require("express");
const router = express.Router();

const { sortController } = require("../controllers/sortController.js");

router.post("/analyze/sort", sortController);

module.exports = router;
