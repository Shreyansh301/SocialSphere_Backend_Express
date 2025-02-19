require('dotenv').config();
const express = require("express");
const app = express ()
const PORT = 8000;
const connectDB = require('./config/db');


// Connect to MongoDB
connectDB();

//Routes 
app.get("/", (req, res) => {
    res.send("Backend is running!");
  });

app.listen(PORT, ()=> console.log(`server started at PORT:${PORT}`))