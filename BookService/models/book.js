const mongoose = require("mongoose");
const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    isbn: {
        type: String,
        required: true,
    },
    bought: {
        type: Number,
        default: 0,
    },
});

const Book = mongoose.model("Book", BookSchema);
module.exports = Book;