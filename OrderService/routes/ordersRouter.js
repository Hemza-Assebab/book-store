const express = require("express");
const { index, store, show, destroy } = require("../controllers/ordersController");
const authMiddleware = require("../middlewares/auth");
const authAdminMiddleware = require("../middlewares/adminAuth");
const router = express.Router();
require("dotenv").config();


router.post("/", authMiddleware, store);
router.get("/", authAdminMiddleware, index);
router.get("/:id", authAdminMiddleware, show);
router.delete("/:id", authAdminMiddleware, destroy);

module.exports = router;