require('dotenv').config();
const express = require("express");
const app = express ()
const PORT = process.env.PORT || 8000;
const connectDB = require('./config/db');
const limiter = require('./middleware/rateLimiter');
const securityMiddleware = require('./middleware/security');
const routes = require('./routes');

// Connect to MongoDB
connectDB();

// Middleware
securityMiddleware(app);
app.use(limiter);

// Routes
app.use('/', routes);

//Routes 
app.get("/", (req, res) => {
    res.send("SocialSphere Backend is running!");
  });

app.listen(PORT, ()=> console.log(`server started at PORT:${PORT}`))