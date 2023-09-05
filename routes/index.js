var express = require('express');
const ImapFunc = require('../imap');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  ImapFunc(res)
});

module.exports = router;
