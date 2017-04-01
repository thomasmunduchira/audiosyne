'use strict';

$(document).ready(function() {
  initializeMyo();
});

let firstMyo;
let secondMyo;
let firstAccelerometerData;
let secondAccelerometerData;

function initializeMyo() {
  Myo.connect();
  Myo.on('connected', function() {
    if (!firstMyo) {
      firstMyo = this;
    } else {
      // secondMyo = this;
    }
    this.streamEMG(true);
  });
  let firstMyoResults = {};
  let secondMyoResults = {};
  setTimeout(() => {
    console.log(firstMyo);
    // console.log(secondMyo);

    firstMyo.on('emg', function(data) {
      firstMyoResults.emg = data;
    });
    firstMyo.on('gyroscope', function(data) {
      firstMyoResults.gyro = data;
    });
    firstMyo.on('orientation', function(data) {
      firstMyoResults.orientation = data;
    });
    firstMyo.on('accelerometer', function(data) {
      firstMyoResults.accelerometer = data;
    });

    // secondMyo.on('emg', function(data) {
    //   secondMyoResults.emg = data;
    // });
    // secondMyo.on('gyroscope', function(data) {
    //   secondMyoResults.gyro = data;
    // });
    // secondMyo.on('orientation', function(data) {
    //   secondMyoResults.orientation = data;
    // });
    // secondMyo.on('accelerometer', function(data) {
    //   secondMyoResults.accelerometer = data;
    // });

    setInterval(() => {
      console.log("First: ", firstMyoResults);
      console.log("Second: ", secondMyoResults);
    }, 3000);

    setInterval(() => {
      firstAccelerometerData = firstMyoResults.accelerometer;
      secondAccelerometerData = secondMyoResults.accelerometer;
    }, 250);

  }, 3000);
}

