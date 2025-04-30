const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        if (!(name && email && password)) return res.status(400).json({message: "All field are required !"});
        if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return res.status(400).json({message: "Invalid email !"});

        const emailExists = await User.findOne({email: email});
        if (emailExists) return res.status(400).json({message: "Email already in use !"});

        const salt = await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash(password, salt);

        const newUser = new User({name, email, password: hashedPass, role: "user"});
        await newUser.save();
        return res.status(201).json({message: "User registered !"});
    } catch (e) {
        res.status(500).json({
            message: "Server error !",
        });
    }
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!(email && password)) return res.status(400).json({ message: "All fields are required !" });

        const user = await User.findOne({email});
        if (!user) return res.status(400).json({ message: "Invalid email or password !" });

        const isCredentialsCorrect = await bcrypt.compare(password, user.password);
        if (!isCredentialsCorrect) return res.status(400).json({ message: "Invalid email or password !" });

        const accessToken = generateToken(user);
        const refreshAccessToken = generateRefreshToken(user);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.ENV === "PROD"
        });

        res.cookie("refreshAccessToken", refreshAccessToken, {
            httpOnly: true,
            secure: process.env.ENV === "PROD"
        });

        res.status(200).json({ message: "You are logged in !" });
    } catch (e) {
        res.status(500).json({ Error: e.message});
    }
}

const generateToken = (user) => {
    return jwt.sign(
        {id: user._id, email: user.email, role: user.role},
        process.env.SECRET_ACCESS_TOKEN,
        {expiresIn: "60min"}
    );
}

const generateRefreshToken = (user) => {
    return jwt.sign(
        {id: user._id, role: user.role},
        process.env.REFRESH_SECRET_TOKEN,
        { expiresIn: '120min' }
    );
}

const refreshAccessToken = (req, res) => {
    const token = req.cookies.refreshAccessToken;
    if (!token) return res.status(401).json({ message: 'Refresh token not found' });
  
    try {
        const decoded = jwt.verify(token, process.env.REFRESH_SECRET_TOKEN);        

        const newAccessToken = jwt.sign({ id: decoded._id, role: decoded.role }, process.env.SECRET_ACCESS_TOKEN, {
        expiresIn: '60min'
        });

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "PROD",
        });
  
        res.status(200).json({ message: 'Access token refreshed' });
    } catch (err) {
        res.status(403).json({ message: 'Invalid refresh token' });
    }
}

const logout = async (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshAccessToken");
    res.status(200).json({message: "Logged out successfully !"});
}

const index = async (req, res) => {
    try {
        const users = await User.find({}, {password: 0, __v: 0});
        res.status(200).json({message: "Users List", users});
    } catch (e) {
        res.status(500).json({message: "Server error !"});
    }
}

const show = async (req, res) => {
    try {
        const {id} = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID !' });

        const user = await User.findOne({_id: id}, {password: 0, __v: 0});
        if (!user) return res.status(404).json({message: "User not found !"});

        return res.status(200).json({message: "User found !", user});
    } catch (e) {
        res.status(500).json({message: "Server error !"});
    }
}

const update = async (req, res) => {
    try {
        const roles = ["admin", "user"];
        const {id} = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID !' });
        
        const updateData = {};
        
        if (req.body.name !== undefined) {
            const name = req.body.name.trim();
            if (!name) return res.status(400).json({ message: "Name can't be empty!" });
            updateData.name = name;
        }
        
        if (req.body.email !== undefined) {
            const email = req.body.email.trim();
            if (!email) return res.status(400).json({ message: "Email can't be empty!" });
            if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return res.status(400).json({ message: "Invalid email!" });

            const emailExists = await User.findOne({email, _id: {$ne: id}});
            if (emailExists) return res.status(400).json({message: "Email already in use !"});

            updateData.email = email;
        }

        if (req.body.password !== undefined) {
            const password = req.body.password.trim();
            if (!password) return res.status(400).json({ message: "Password can't be empty!" });

            const salt = await bcrypt.genSalt();
            const hashedPass = await bcrypt.hash(password, salt);
            updateData.password = hashedPass;
        }

        if (req.body.role !== undefined) {
            const role = req.body.role.trim();
            if (!role) return res.status(400).json({ message: "Role can't be empty!" });
            if (!(roles.includes(role))) return res.status(400).json({ message: "Invalid role!" });
            updateData.role = role;
        }

        if (Object.keys(updateData).length === 0) return res.status(400).json({ message: "No fields provided to update!" });

        const userUpdated = await User.findByIdAndUpdate(id, updateData, {runValidators: true});
        if (!userUpdated) return res.status(404).json({message: "User not found !"});
        return res.status(200).json({message: "User updated !"});
    } catch (e) {
        res.status(500).json({message: "Server error !"})
    }
}

const destroy = async (req, res) => {
    try {
        const {id} = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID !' });

        const userDeleted = await User.findByIdAndDelete(id);
        if (!userDeleted) return res.status(404).json({message: "User not found !"});

        return res.status(200).json({message: "User deleted !"});
    } catch (e) {
        res.status(500).json({message: "Server error !"});
    }
}

module.exports = {
    register,
    login,
    logout,
    refreshAccessToken,
    index,
    show,
    update,
    destroy,
}