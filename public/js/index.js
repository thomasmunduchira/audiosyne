'use strict';

$(document).ready(function() {
  initializeMyo();
});

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

    var inta = setInterval(() => {
      // console.log("First: ", firstMyoResults);
      // console.log("Second: ", secondMyoResults);
    }, 3000);
    setInterval(() => {
      clearInterval(inta);
    }, 13000);

    let good = true;

    setInterval(() => {
      const orientation = firstMyoResults.orientation;
      console.log(orientation);
      const params = [orientation.x, orientation.y, orientation.z];
      if (Math.abs(orientation.w - 1) > 0.1) {
        good = false;
      }
      params.forEach(function(value)  {
        if (Math.abs(value) > 0.1) {
          good = false;
        }
      });
      if (good) {
        console.log("good");
      }
      good = true;
    }, 2000);
  }, 3000);
}
