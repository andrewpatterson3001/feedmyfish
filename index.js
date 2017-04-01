var config = require('./config.json')

var five = require('johnny-five');
var raspi = require('raspi-io');

var Device = require('losant-mqtt').Device;

var StepperWiringPi = require("stepper-wiringpi");

// Construct Losant device.
var device = new Device({
  id: config.myDeviceId,
  key: config.myAccessKey,
  secret: config.myAccessSecret
});

// Connect the device to Losant.
device.connect();

var board = new five.Board({
  io: new raspi()
});


board.on('ready', function() {
  // Hook the command event listener.
  device.on('command', function(command) {
    if(command.name === 'spinMotor') {
      var motor = StepperWiringPi.setup(2048, 17, 18, 27, 22);
      var steps = command.payload.steps || 10240
	motor.setSpeed(15);
	motor.step(steps);
	motor.stop();
        device.sendState({spinsCompleted:(steps/2048)})
    }
  });
});

