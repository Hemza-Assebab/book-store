const express = require("express");
const router = express.Router();
const { store, index, show, destroy } = require("../controllers/inventoryController");

router.post("/", store);
router.get("/", index);
router.get("/:bookId", show);
router.delete("/", destroy);

module.exports = router;