'use strict';

var GoogleAuth;
let action = [];
var answer = "hack";
const buffer = 0.4;
var response;

var trainAPIRequest;
var predictAPIRequest;
var updateAPIRequest;

function initClient() {
  gapi.client.init({
    'apiKey': 'jRPnU0LMkuC4g7fhk17QHoU_',
    'clientId': '182388039064-fs0fglfvdgeeb5nnj93mui349rp100n6.apps.googleusercontent.com',
    'scope': 'https://www.googleapis.com/auth/prediction'
  }).then(function() {
    trainAPIRequest = gapi.client.request({
      'method': 'POST',
      'path': '/prediction/v1.6/projects/sign-language-speech/trainedmodels',
      'body': {
        id: "gestures",
        modelType: "CLASSIFICATION"
      }
    });

    GoogleAuth = gapi.auth2.getAuthInstance();

    // if (GoogleAuth.isSignedIn) {
    //   trainSignIn(GoogleAuth.isSignedIn);
    // } else {
    //   GoogleAuth.isSignedIn.listen(trainSignIn);
    //   GoogleAuth.signIn();
    // }
  });
}

var isAuthorized;

function sendAuthorizedApiRequest(request) {
  if (isAuthorized) {
    request.execute(function(responsed) {
      response = responsed;
      console.log(responsed);
      responsiveVoice.speak(responsed.outputLabel);
      document.getElementById("text").innerHTML = responsed.outputLabel;
    });
  } else {
    GoogleAuth.signIn();
  }
}

function trainSignIn(isSignedIn) {
  updateSigninStatus(isSignedIn, trainAPIRequest);
}

function predictSignIn(isSignedIn) {
  updateSigninStatus(isSignedIn, predictAPIRequest);
}

function updateSignIn(isSignedIn) {
  updateSigninStatus(isSignedIn, updateAPIRequest);
}

function updateSigninStatus(isSignedIn, currentApiRequest) {
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
  gapi.load('client:auth2', initClient);

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
        let secondOrientation = secondMyoResults.orientation;
        let firstParams = [firstOrientation.x, firstOrientation.y, firstOrientation.z];
        let secondParams = [secondOrientation.x, secondOrientation.y, secondOrientation.z];
        if (Math.abs(firstOrientation.w - 1) > buffer) {
          outside = true;
        }
        firstParams.forEach(function(value)  {
          if (Math.abs(value) > buffer) {
            outside = true;
          }
        });
        if (Math.abs(secondOrientation.w - 1) > buffer) {
          outside = true;
        }
        secondParams.forEach(function(value)  {
          if (Math.abs(value) > buffer) {
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

            predictAPIRequest = gapi.client.request({
              'method': 'POST',
              'path': '/prediction/v1.6/projects/sign-language-speech/trainedmodels/gestures/predict',
              'body': {
                "input": {
                  "csvInstance": action
                }
              }
            });

            updateAPIRequest = gapi.client.request({
              'method': 'PUT',
              'path': '/prediction/v1.6/projects/sign-language-speech/trainedmodels/gestures',
              'body': {
                "output": answer,
                "csvInstance": action
              },
              'params': {
                "id": "gestures",
                "project": "sign-language-speech"
              }
            });

            predictSignIn(GoogleAuth.isSignedIn);

            // updateSignIn(GoogleAuth.isSignedIn);

          }, 2100);
        }
      }, 100);
    }, 3000);
  }
});
