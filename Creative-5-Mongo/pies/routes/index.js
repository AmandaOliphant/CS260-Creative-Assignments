var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Pie = mongoose.model('Pie');

router.get('/pies', function(req, res, next) {
  console.log("In the search route!");
  var query = req.query.q;
  var obj = {};
  if (query) {
    obj = { title: query };
  }
  Pie.find(obj, function(err, pies) {
    if (err) { return next(err); }
    res.json(pies);
  });
});

router.post('/pies', function(req, res, next) {
  var pie = new Pie(req.body);
  pie.save(function(err, pie) {
    if (err) { return next(err); }
    res.json(pie);
  });
});

router.param('pie', function(req, res, next, id) {
  var query = Pie.findById(id);
  query.exec(function(err, pie) {
    if (err) { return next(err); }
    if (!pie) { return next(new Error("can't find pie")); }
    req.pie = pie;
    return next();
  });
});

router.get('/pies/:pie', function(req, res) {
  res.json(req.pie);
})

router.delete('/pies/:pie', function(req, res) {
  console.log("Deleting")
  req.pie.remove();
  res.sendStatus(200);
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
