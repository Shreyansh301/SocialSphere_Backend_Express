require('dotenv').config();
const express = require("express");
const app = express ()
const PORT = process.env.PORT || 8000;
const connectDB = require('./config/db');
const limiter = require('./middleware/rateLimiter');
const securityMiddleware = require('./middleware/security');


// Connect to MongoDB
connectDB();

// Middleware
securityMiddleware(app);
app.use(limiter);

//Routes 
app.get("/", (req, res) => {
    res.send("Backend is running!");
  });

app.listen(PORT, ()=> console.log(`server started at PORT:${PORT}`))