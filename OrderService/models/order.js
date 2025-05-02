const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    bookId:  {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    orderedAt: {
        type: Date,
        required: true,
    },
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;