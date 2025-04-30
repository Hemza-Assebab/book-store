const Inventory = require("../models/inventory");
const mongoose = require("mongoose");

const store = async (req, res) => {
    try {
        const {bookId, quantity} = req.body;
        if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).json({ message: 'Invalid ID !' });
        if (!(typeof Number(quantity) === 'number' && !isNaN(quantity))) return res.status(400).json({message: "Invalid quantity !"});
        
        const newStock = new Inventory({bookId, quantity, lastRestockDate: Date.now()});
        await newStock.save();
        
        return res.status(201).json({message: "Book Stock Added !"});
    } catch (e) {
        res.status(500).json({message: "Server error !"});
    }
}

const index = async (req, res) => {
    try {
        const stocks = await Inventory.find({}, {__v: 0});
        res.status(200).json({message: "Stocks List", stocks});
    } catch (e) {
        res.status(500).json({message: "Server error !"});
    }
}

const show = async (req, res) => {
    try {
        const {bookId} = req.params;
        if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).json({ message: 'Invalid ID !' });
        
        // const response = await fetch(`http://localhost:3001/api/books/${bookId}`, {
        //     method: "GET",
        //     headers: {
        //         Cookie: req.headers.cookie || "",
        //     }
        // });

        // if (response.status == 404) return res.status(404).json({message: "Book not found !"});

        const stock = await Inventory.findById(bookId, {quantity: 1});
        if (!stock) return res.status(404).json({message: "Book Stock Not Found !"});
        res.status(200).json(stock);
    } catch (e) {
        res.status(500).json({message: e.message});
    }
}

const update = async (req, res) => {

}

module.exports = {
    store,
    index,
    show,
    // update,
}