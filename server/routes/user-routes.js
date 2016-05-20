var jwt = require('jsonwebtoken');
var express = require('express');
var path = require('path'); 
var base = path.resolve(__dirname + '/../..');
var Garage = require(base + '/server/models/garage');

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
	userRoutes.get('/garage/status', function(req,res){
		var user = req.decoded;

		Garage.find({ username: user.username }, function(err,garage){
			if (err){
				res.send(err);
				return;
			}
			res.json({
				success: true,
				name: garage[0].name,
				status: garage[0].actualState
			});
		});
	});

	userRoutes.get('/garage', function(req,res){
		var user = req.decoded;

		Garage.find({ username: user.username }, function(err,garage){
			if (err){
				res.send(err);
				return;
			}
			res.json(garage);
		});

	});

	userRoutes.post('/garage', function(req,res){

		var user = req.decoded;

		// Right now this supports only one garage sensor per person
		Garage.find({ username: user.username }, function(err,garage){
			
			// Return error cases first
			if (err){
				res.send(err);
				return;
			} 
			if (!req.body.username || req.body.username != user.username) {
				res.json({
					success: false,
					message: "Error: You must provide a valid username!"
				});
				return;
			} 
			if (garage.length > 0){
				res.json({
					success: false,
					message: "Error: You can only have one garage tied to your account!"
				});
				return;
			}

			Garage.create({
				name: 					req.body.name,
				description: 			req.body.description,
				dateAdded: 				req.body.dateAdded,
				actualState: 			req.body.actualState,
				actualStateChangeTime: 	req.body.actualStateChangeTime,
				desiredStateChangeTime: req.body.desiredStateChangeTime,
				desiredState: 			req.body.desiredState,
				active: 				req.body.active,
				username: 				req.body.username 
			}, function(err,garage){
				if (err) {
					res.send(err)
				} else {
					res.json({ success: true, message: 'Garage successfully created!' });
				}
			});

		});

	});


	userRoutes.delete('/garage/:id', function(req,res){

		var user = req.decoded;
		if (user.username != req.params.username){
			res.json({
				success: false,
				message: "Unable to delete your garage!"
			});
		} else {
			Garage.remove({ _id: req.params.id }, function(err,garage){
				if (err) {
					res.send(err)
				} else {
					res.json({ message: 'Successfully removed garage with id ' + garage._id });
				}
			});
		}
	});

	app.use('/user',userRoutes);

};