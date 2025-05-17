require("dotenv").config();
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

        const stock = await Inventory.findOne({bookId: bookId}, {quantity: 1, _id: 0});
        if (!stock) return res.status(404).json({message: "Book Not Found In Stock!"});
        res.status(200).json(stock);
    } catch (e) {
        res.status(500).json({message: "Server Error !"});
    }
}

const update = async (req, res) => {
    try {
        const {bookId} = req.params;
        const {quantity} = req.body;

        if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).json({ message: 'Invalid ID !' });
        if (!(typeof Number(quantity) === 'number' && !isNaN(quantity))) return res.status(400).json({message: "Invalid quantity !"});

        const updatedStock = await Inventory.updateOne({bookId: bookId}, {$set: {quantity: quantity}});
        if (!updatedStock) return res.status(404).json({message: "Book Not Found In Stock!"});
        res.status(200).json({message: "Stock Updated !"});
    } catch (e) {
        res.status(500).json({message: "Server Error !"});
    }
}

const destroy = async (req, res) => {
    try {
        const {bookId} = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).json({ message: 'Invalid ID !' });

        const deletedStock = await Inventory.deleteOne({bookId: bookId});
        if (!deletedStock) return res.status(404).json({message: "Book Stock Not Found!"});

        res.status(200).json({message: "Book Stock Deleted"});
    } catch (e) {
        res.status(500).json({message: "Server Error !"});
    }
}

module.exports = {
    store,
    index,
    show,
    destroy,
    update,
}