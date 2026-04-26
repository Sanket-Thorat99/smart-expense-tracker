const express = require('express');
const cors = require("cors");
require("dotenv").config();

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

  
const app = express();

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("API is Loading");
}); 

const PORT = 3010;
app.listen(PORT, ()=>{
    console.log("Server is started at port 3010");
});
