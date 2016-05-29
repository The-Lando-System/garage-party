var jwt = require('jsonwebtoken');
var express = require('express');
var path = require('path'); 
var base = path.resolve(__dirname + '/../..');
var Garage = require(base + '/server/models/garage');

var sensorRoutes = express.Router();

module.exports = function(app) {

  sensorRoutes.post('/update-garage-state/:sensorId', function(req,res){

    Garage.find({ sensorId: req.params.sensorId }, function(err,garage){
      if (err){
        res.send(err);
        return;
      }
      if (garage.length === 0){
        res.json({
          success: false,
          message: "Error: Could not find a garage tied to the given sensor ID!"
        });
        return;
      }
      if (!(req.body.hasOwnProperty('actualState') && req.body.hasOwnProperty('actualStateChangeTime'))){
        res.send({
          success: false,
          message: "Body must contain actualState and actualStateChangeTime properties!"
        });
        return;
      }

      if (garage[0].actualState === req.body.actualState){
        res.send({
          success: false,
          message: "No state change detected."
        });
        return;
      }

      garage[0].actualState            = req.body.actualState;
      garage[0].actualStateChangeTime  = req.body.actualStateChangeTime;

      garage[0].save(function(err){
        if (err){
          res.send(err);
        }
        res.send({
          success: true,
          message: "Garage state successfully changed!"
        });
      });

    });


  });




  app.use('/sensor',sensorRoutes);

};