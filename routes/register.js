const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registerController');

router.post('/', registrationController.handleNewUser);

module.exports = router;
