var express = require('express');
var router = express.Router();
var request = require('request');
var Promise = require('bluebird');
//var _apiMsUrl = "http://seidue.crs4.it:3009/api/v1/";
var _apiMsUrl = "http://localhost:3000/api/v1/";




router.get('/',  function(req, res, next) {
  console.log('inside router get loadevaluations');
  var options =
  {
	  url: _apiMsUrl + "/evaluations",
	  method: 'GET'
  };
  request.get(options, function(error, response, body)
		 {
				 if(error)
				 {
					 const decodeError = new Error();
					 decodeError.message = error.message;
					 decodeError.stack = error.stack;
					 console.log('Error message: ' + decodeError.message);
					 console.log('Error stack: ' + decodeError.stack);
					 return reject(decodeError);
				 }
				 var r = {};
				 r.body = JSON.parse(body);
				 r.response = response;
				 return res.send(r);
			  });
});


module.exports = router;
