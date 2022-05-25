//user api
const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController')






router.post('/User',userController.registerUser);

module.exports = router;