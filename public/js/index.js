'use strict';

$(document).ready(function() {
  initializeMyo();
});

/******** Myo Armband ******/
let firstMyo;
let secondMyo;
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
    firstMyo.zeroOrientation();
    // second.zeroOrientation();
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

    let outside = false;
    let inSession = false;
    let action = [];

    setInterval(() => {
      let orientation = firstMyoResults.orientation;
      let emg = firstMyoResults.emg;
      let params = [orientation.x, orientation.y, orientation.z];
      if (Math.abs(orientation.w - 1) > 0.2) {
        outside = true;
      }
      params.forEach(function(value)  {
        if (Math.abs(value) > 0.2) {
          outside = true;
        }
      });
      if (outside && !inSession) {
        inSession = true;
        action = [];
        console.log("Start");
        var ital = setInterval(() => {
          console.log("Recorded snapshot");
          orientation = firstMyoResults.orientation;
          emg = firstMyoResults.emg;
          action.push(emg[0], emg[1], emg[2], emg[3], emg[4], emg[5], emg[6], emg[7], orientation.w, orientation.x, orientation.y, orientation.z);
        }, 250);
        setTimeout(() => {
          outside = false;
          inSession = false;
          clearInterval(ital);
          console.log("End");
          console.log(action);
          action = [];
        }, 2000);
      }
    }, 100);
  }, 3000);
}
