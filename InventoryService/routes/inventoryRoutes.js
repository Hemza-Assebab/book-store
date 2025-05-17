const express = require("express");
const router = express.Router();
const { store, index, show, update, destroy } = require("../controllers/inventoryController");
const authMiddleware = require("../middlewares/auth");
require("dotenv").config();

router.post("/", authMiddleware, store);
router.get("/", authMiddleware, index);
router.get("/:bookId", authMiddleware, show);
router.put("/:bookId", authMiddleware, update);
router.delete("/:bookId", authMiddleware, destroy);

module.exports = router;