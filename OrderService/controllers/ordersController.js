const Order = require("../models/order");
const mongoose = require("mongoose");

const store = async (req, res) => {
    try {
        const userId = req.user.id;
        const {bookId} = req.body;

        const bookResponse = await fetch(`http://localhost:3001/api/books/${bookId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cookie": req.headers.cookie || "",
            },
        });
        if (!bookResponse.ok) return res.status(404).json({message: "Book Not Found !"});
        const {book} = await bookResponse.json();

        const inventoryResponse = await fetch(`http://localhost:3002/api/inventory/${bookId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cookie": req.headers.cookie || "",
            },
        });
        if (!inventoryResponse.ok) return res.status(404).json({message: "Book Not Found In Stock!"});

        const {quantity} = await inventoryResponse.json();
        if (quantity === 0) return res.status(404).json({message: "We are out of stock for this book"});
        
        const order = new Order({userId, bookId, price: book.price, orderedAt: Date.now()});

        const updateInventoryResponse = await fetch(`http://localhost:3002/api/inventory/${bookId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Cookie": req.headers.cookie || "",
            },
            body: JSON.stringify({quantity: (quantity - 1)})
        });

        if (!updateInventoryResponse.ok) return res.status(500).json({message: "Error while updating the stock"});
        await order.save();
        return res.status(201).json({message: "Book Ordered !"});
    } catch (e) {
        return res.status(500).json({message: "Server Error !"});
    }
}

const index = async (req, res) => {
    try {
        const orders = await Order.find({}, {__v: 0});
        res.status(200).json({message: "Orders List", orders});
    } catch (e) {
        res.status(500).json({message: "Server error !"});
    }
}

const show = async (req, res) => {
    try {
        const {id} = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID !' });

        const order = await Order.findOne({_id: id}, {__v: 0});
        if (!order) return res.status(404).json({message: "Book Not Found In Stock!"});
        res.status(200).json({message: "Order Found !", order});
    } catch (e) {
        res.status(500).json({message: "Server error !"});
    }
}

const destroy = async (req, res) => {
    try {
        const {id} = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID !' });

        const deletedOrder = await Order.deleteOne({_id: id});
        if (!deletedOrder) return res.status(404).json({message: "Order Not Found !"});

        res.status(200).json({message: "Order Deleted !"});
    } catch (e) {
        res.status(500).json({message: "Server Error !"});
    }
}

module.exports = {
    store,
    index,
    show,
    destroy
}