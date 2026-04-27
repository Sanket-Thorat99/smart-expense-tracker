const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authRouter = express.Router();

//SignUP
authRouter.post("/register",async (req,res)=>{
    try{
        const {name, email, password} = req.body;

        const userExists = await User.findOne({email});
        if(userExists){
            return res.send.status(400).json({msg: "User Already Exists"});
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.json({msg:"User Registered Successfully!"});
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});

//LOGIN
authRouter.post("/login", async (req,res)=>{
    try{
        const {email,password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            res.send.status(400).json({msg: "User Not Found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.send.status(400).json({msg: "Invalid Credentials"});
        }

        const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

        res.json({
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
        });
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

module.exports = authRouter;
