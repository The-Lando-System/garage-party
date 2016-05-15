var jwt = require('jsonwebtoken');
var express = require('express');
var passwordHash = require('password-hash');
var path = require('path'); 
var base = path.resolve(__dirname + '/../..');
var User = require(base + '/server/models/user');

var adminUserRoutes = express.Router();

module.exports = function(app) {

	// Verify user token and ensure they are an admin role ==============================
	adminUserRoutes.use(function(req,res,next){
		var token = req.body.token || req.query.token || req.headers['x-access-token'];
		if (token) {
			jwt.verify(token, app.get('superSecret'), function(err,decoded){
				if (err) {
					return res.json({ success: false, message: err.name});
				} else {
					if (decoded._doc.role === 'admin'){
						req.decoded = decoded._doc;
						next();
					} else {
						return res.json({ success: false, message: 'You do not have an admin role!'});
					}
				}
			});
		} else {
			return res.status(403).send({
				success: false,
				message: 'No token provided!'
			});
		}
	});

	// Routes for the users API, only exposed to admin users ======================
	adminUserRoutes.get('/users', function(req,res){
		User.find({}, function(err,users){
			if (err) { 
				res.send(err)
			} else {
				res.json(users);
			}
		});
	});
	adminUserRoutes.post('/users', function(req,res){

		// Attempt to find if the username already exists
		User.find({ username: req.body.username }, function(err,user){

			if (err){
				res.send(err);
			} else {
				if(user.length > 0){
					res.json({ 
						success: false,
						message: 'Error: A user already exists with the username ' + req.body.username
					});
				} else {
					User.create({
						firstName: req.body.firstName,
						lastName:  req.body.lastName,
						email:     req.body.email,
						username:  req.body.username,
						password:  passwordHash.generate(req.body.password),
						role:      req.body.role 
					}, function(err,user){
						if (err) {
							res.send(err)
						} else {
							res.json({ success: true, message: 'User successfully created!' });
						}
					});
				}

			}

		});
	});

	adminUserRoutes.delete('/users/:id', function(req,res){
		User.remove({ _id: req.params.id }, function(err,user){
			if (err) {
				res.send(err)
			} else {
				res.json({ message: 'Successfully removed user with id ' + req.params.id });
			}
		});
	});
	adminUserRoutes.put('/users/:id', function(req,res){
		User.findById(req.params.id, function(err,user){
			if (err) { res.send(err) };
			var passwd = req.body.password.trim() === '' ? user.password : passwordHash.generate(req.body.password);
			user.firstName = req.body.firstName || user.firstName;
			user.lastName  = req.body.lastName  || user.lastName;
			user.email     = req.body.email     || user.email;
			user.username  = req.body.username  || user.username;
			user.password  = passwd;
			user.role      = req.body.role      || user.role;
			user.save(function(err){
				if (err) {
					res.send(err)
				} else {
					res.json({ message: 'User with ID ' + req.params.id + ' was successfully updated!' });
				}
			});
		});
	});

	// Other admin routes ==============================================
	adminUserRoutes.get('/goodbye/:username', function(req,res){
		var goodbye = {
			name: "GoodbyeMessage",
			description: "This message says goodbye",
			message: "Goodbye " + req.params.username
		};
		res.json(goodbye);
	});

	app.use('/admin',adminUserRoutes);

};