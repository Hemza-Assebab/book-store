const express = require("express");
const { index, show, store, update, destroy } = require("../controllers/booksController");
const authAdminMiddleware = require("../middlewares/adminAuth");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();
require("dotenv").config();

router.get("/", authMiddleware, index);
router.get("/:id", authMiddleware, show);
router.post("/", authAdminMiddleware, store);
router.put("/:id", authAdminMiddleware, update);
router.delete("/:id", authAdminMiddleware, destroy);

module.exports = router;