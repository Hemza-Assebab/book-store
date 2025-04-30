const express = require("express");
const router = express.Router();
const { store, index, show } = require("../controllers/inventoryController");

router.post("/", store);
router.get("/", index);
router.get("/:bookId", show);

module.exports = router;