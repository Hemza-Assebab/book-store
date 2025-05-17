const mongoose = require("mongoose");
require("dotenv").config();

const InventorySchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    lastRestockDate: {
        type: Date,
        required: true,
    }
});

const Inventory = mongoose.model("Inventory", InventorySchema);
module.exports = Inventory;