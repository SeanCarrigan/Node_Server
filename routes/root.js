const express = require('express');
const router = express.Router();
const path = require('path');

// regex: route starts with a '/' and ends with a '/' OR is specified with '/index'.
// anything inside ()? makes it optional. in this case '.html' is not required
router.get('^/$|/index(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

module.exports = router
