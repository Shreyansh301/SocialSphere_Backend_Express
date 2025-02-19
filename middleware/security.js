const express = require("express");
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const securityMiddleware = (app) => {
  app.use(cors({
    origin: "https://social-sphere-vert.vercel.app",
    credentials: true,
  }));
  app.use(helmet());
  app.use(morgan('combined'));
  app.use(express.json());
};

module.exports = securityMiddleware; 