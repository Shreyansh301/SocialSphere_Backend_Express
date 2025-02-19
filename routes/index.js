const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/users', require('./userRoutes'));
router.use('/', require('./friendRoutes'));
router.use('/', require('./postRoutes'));

module.exports = router;