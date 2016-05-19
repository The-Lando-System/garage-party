var jwt = require('jsonwebtoken');
var express = require('express');

var userRoutes = express.Router();

module.exports = function(app) {

	// Verify user token ===========================
	userRoutes.use(function(req,res,next){
		var token = req.body.token || req.query.token || req.headers['x-access-token'];
		if (token) {
			jwt.verify(token, app.get('superSecret'), function(err,decoded){
				if (err) {
					return res.json({ success: false, message: err.name});
				} else {
					req.decoded = decoded._doc;
					next();
				}
			});
		} else {
			return res.status(403).send({
				success: false,
				message: 'No token provided!'
			});
		}
	});

	// User routes ==================================
	userRoutes.get('/garage/status/:username', function(req,res){
		var user = req.decoded;
		if (user.username != req.params.username){
			res.json({
				success: false,
				message: "Unable to get the status of your garage!"
			});
		} else {
			// Get the garage status from the DB
			var status = {
				success: true,
				name: "My Garage",
				status: "Open"
			};
			res.json(status);
		}
	});

	app.use('/user',userRoutes);

};