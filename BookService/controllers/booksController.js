const Book = require("../models/book");
const mongoose = require("mongoose");

const index = async (req, res) => {
    try {
        const books = await Book.find({}, {__v: 0});
        res.status(200).json({message: "Books List", books});
    } catch (e) {
        res.status(500).json({message: "Server error !"});
    }
};

const show = async (req, res) => {
    try {
        const {id} = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID !' });

        const book = await Book.findOne({_id: id});
        if (!book) return res.status(404).json({message: "Book not found !"});

        return res.status(200).json({message: "Book found !", book});
    } catch (e) {
        res.status(500).json({message: "Server error !"});
    }
};

const store = async (req, res) => {
    try {
        const {title, author, description, price, category, isbn, quantity} = req.body;
        if (!(title && author && description && price && category && isbn)) return res.status(400).json({message: "All field are required !"});
        if (!(typeof Number(price) === 'number' && !isNaN(price))) return res.status(400).json({message: "Invalid price !"});
        if (!(typeof Number(quantity) === 'number' && !isNaN(quantity))) return res.status(400).json({message: "Invalid quantity !"});

        const isbnExists = await Book.findOne({isbn: isbn});
        if (isbnExists) return res.status(400).json({message: "ISBN already exists !"});

        const newBook = new Book({title, author, description, price, category, isbn});
        
        const response = await fetch ("http://localhost:3002/api/inventory", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": req.headers.cookie || "",
            },
            body: JSON.stringify({bookId: newBook._id, quantity}),
        });

        if (!response.ok) return res.status(500).json({message: "Book wasn't added to stock !"});

        await newBook.save();
        
        return res.status(201).json({message: "Book Added !"});
    } catch (e) {
        res.status(500).json({message: "Server error !"});
    }
};

const update = async (req, res) => {
    try {
        const {id} = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID !' });
        
        const updateData = {};
        
        if (req.body.title !== undefined) {
            const title = req.body.title;
            if (!title) return res.status(400).json({ message: "Title can't be empty!" });
            updateData.title = title;
        }

        if (req.body.author !== undefined) {
            const author = req.body.author;
            if (!author) return res.status(400).json({ message: "Author can't be empty!" });
            updateData.author = author;
        }

        if (req.body.description !== undefined) {
            const description = req.body.description;
            if (!description) return res.status(400).json({ message: "Description can't be empty!" });
            updateData.description = description;
        }

        if (req.body.price !== undefined) {
            const price = req.body.price;
            if (!price) return res.status(400).json({ message: "Price can't be empty!" });
            if (!(typeof Number(price) === 'number' && !isNaN(price))) return res.status(400).json({message: "Invalid price !"});
            updateData.price = price;
        }

        if (req.body.category !== undefined) {
            const category = req.body.category;
            if (!category) return res.status(400).json({ message: "Category can't be empty!" });
            updateData.price = category;
        }

        if (req.body.isbn !== undefined) {
            const isbn = req.body.isbn;
            if (!isbn) return res.status(400).json({ message: "ISBN can't be empty!" });

            const isbnExists = await Book.findOne({isbn, _id: {$ne: id}});
            if (isbnExists) return res.status(400).json({message: "ISBN already exists !"});

            updateData.isbn = isbn;
        }

        if (Object.keys(updateData).length === 0) return res.status(400).json({ message: "No fields provided to update!" });

        const bookUpdated = await Book.findByIdAndUpdate(id, updateData, {runValidators: true});
        if (!bookUpdated) return res.status(404).json({message: "Book not found !"});
        return res.status(200).json({message: "Book updated !"});
    } catch (e) {
        res.status(500).json({message: "Server error !"})
    }
};

const destroy = async (req, res) => {
    try {
        const {id} = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID !' });

        const bookDeleted = await Book.findByIdAndDelete(id);
        if (!bookDeleted) return res.status(404).json({message: "Book not found !"});

        return res.status(200).json({message: "Book deleted !"});
    } catch (e) {
        res.status(500).json({message: "Server error !"});
    }
};

module.exports = {
    index,
    show,
    store,
    update,
    destroy,
}