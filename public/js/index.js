'use strict';

$(document).ready(function() {
  initializeMyo();
});

let first;
let second;

function initializeMyo() {
  Myo.connect();
  Myo.on('connected', function() {
    if (!first) {
      first = this;
      second = this;
    } else {
      second = this;
    }
    this.streamEMG(true);
  });
  let firstResults;
  let secondResults;
  setTimeout(() => {
    console.log(first);
    console.log(second);
    first.on('emg', function(data) {
      firstResults = data;
    });
    second.on('emg', function(data) {
      secondResults = data;
    });
    setInterval(() => {
      console.log("First: ", firstResults);
      console.log("Second: ", secondResults);
    }, 3000);
  }, 3000);
}
