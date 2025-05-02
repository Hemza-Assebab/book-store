const express = require("express");
const router = express.Router();
const { store, index, show, update, destroy } = require("../controllers/inventoryController");
const authAdminMiddleware = require("../middlewares/adminAuth");

router.post("/", authAdminMiddleware, store);
router.get("/", authAdminMiddleware, index);
router.get("/:bookId", authAdminMiddleware, show);
router.put("/:bookId", authAdminMiddleware, update);
router.delete("/:bookId", authAdminMiddleware, destroy);

module.exports = router;