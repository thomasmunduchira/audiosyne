'use strict';

var GoogleAuth;
var action = [];

function initClient() {
  gapi.client.init({
    'apiKey': 'KEY',
    'clientId': 'CLIENT_ID',
    'scope': 'https://www.googleapis.com/auth/prediction'
  }).then(function() {
    GoogleAuth = gapi.auth2.getAuthInstance();
    // var currentApiRequest = gapi.client.request({
    //   'method': 'POST',
    //   'path': '/prediction/v1.6/projects/sign-language-speech/trainedmodels',
    //   'params': {
    //     id: "gestures",
    //     modelType: "CLASSIFICATION"
    //   }
    // });

    var currentApiRequest = gapi.client.request({
      'method': 'POST',
      'path': '/prediction/v1.6/projects/sign-language-speech/trainedmodels/gestures/predict',
      'params': {
        "input": {
          "csvInstance": action
        }
      }
    });

    var answer = "";

    // var currentApiRequest = gapi.client.request({
    //   'method': 'PUT',
    //   'path': '/prediction/v1.6/projects/sign-language-speech/trainedmodels/gestures',
    //   'params': {
    //     "output": answer,
    //     "csvInstance": action
    //   }
    // });
  });
}

var isAuthorized;

function sendAuthorizedApiRequest(requestDetails) {
  currentApiRequest = requestDetails;
  if (isAuthorized) {
    request.execute(function(response) {
      console.log(response);
    });
    currentApiRequest = {};
  } else {
    GoogleAuth.signIn();
  }
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    isAuthorized = true;
    if (currentApiRequest) {
      sendAuthorizedApiRequest(currentApiRequest);
    }
  } else {
    isAuthorized = false;
  }
}

$(document).ready(function() {
  initializeMyo();
  gapi.load('client', initClient);

  let firstMyo;
  let secondMyo;
  function initializeMyo() {
    Myo.connect();
    Myo.on('connected', function() {
      if (!firstMyo) {
        firstMyo = this;
      } else {
        secondMyo = this;
      }
      this.streamEMG(true);
    });
    let firstMyoResults = {};
    let secondMyoResults = {};
    setTimeout(() => {
      firstMyo.zeroOrientation();
      secondMyo.zeroOrientation();
      console.log(firstMyo);
      console.log(secondMyo);

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

      secondMyo.on('emg', function(data) {
        secondMyoResults.emg = data;
      });
      secondMyo.on('gyroscope', function(data) {
        secondMyoResults.gyro = data;
      });
      secondMyo.on('orientation', function(data) {
        secondMyoResults.orientation = data;
      });
      secondMyo.on('accelerometer', function(data) {
        secondMyoResults.accelerometer = data;
      });

      let outside = false;
      let inSession = false;

      setInterval(() => {
        let firstOrientation = firstMyoResults.orientation;
        let params = [firstOrientation.x, firstOrientation.y, firstOrientation.z];
        if (Math.abs(firstOrientation.w - 1) > 0.2) {
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
            firstOrientation = firstMyoResults.orientation;
            let secondOrientation = secondMyoResults.orientation;
            let firstEmg = firstMyoResults.emg;
            let secondEmg = secondMyoResults.emg;
            action.push(firstEmg[0], firstEmg[1], firstEmg[2], firstEmg[3], firstEmg[4], firstEmg[5], firstEmg[6], firstEmg[7], firstOrientation.w, firstOrientation.x, firstOrientation.y, firstOrientation.z, secondEmg[0], secondEmg[1], secondEmg[2], secondEmg[3], secondEmg[4], secondEmg[5], secondEmg[6], secondEmg[7], secondOrientation.w, secondOrientation.x, secondOrientation.y, secondOrientation.z);
          }, 250);
          setTimeout(() => {
            outside = false;
            inSession = false;
            clearInterval(ital);
            console.log("End");
            console.log(action);
            GoogleAuth.isSignedIn.listen(updateSigninStatus);
            action = [];
          }, 2100);
        }
      }, 100);
    }, 3000);
  }
});
