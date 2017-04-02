var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
  res.render('index', {
    title: 'LA Hacks 2017'
  });
});

router.get('/gesture', function(req, res) {
  const data = req.data;
  let phrase = "hahaaha";
  res.json({
    success: true,
    phrase: phrase
  });
});

module.exports = router;
