var express = require('express');
var fft = require('fft-js').fft;
var router = express.Router();

/* GET home page. */

router.post('/fft', function(req, res) {
  const data = req.body.arr;
  var phasors = fft(data);
  console.log(phasors);
  res.json({
    success: true,
    result: phasors
  });
});

router.get('/', function(req, res) {
  res.render('index', {
    title: 'Audiosyne'
  });
});

module.exports = router;
