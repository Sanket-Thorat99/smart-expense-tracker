const express = require('express');
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const authMiddleware = require("./middleware/authMiddleware");


const app = express();

//  FIRST middleware
app.use(cors());
app.use(express.json());

// THEN routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const transactionRoutes = require("./routes/transaction");
app.use("/api/transactions", transactionRoutes);

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("API is Loading");
});

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    msg: "Protected route accessed",
    user: req.user
  });
});

const PORT = 3010;
app.listen(PORT, () => {
  console.log("Server is started at port 3010");
});