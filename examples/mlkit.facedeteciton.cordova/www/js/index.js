var app = {
  startCamera: function(){
    const cameraDiv = document.getElementById('originalPicture');
    const cDivRect = cameraDiv.getBoundingClientRect();
    const x = cDivRect.left;
    const y = cDivRect.top;
    const height = cDivRect.height;
    const width = cDivRect.width;

    const options = {
      x: x,
      y: y,
      width: width,
      height: height,
      front: false,
      cameraPixel:'640x480',
      minFaceSize: 0.5,
      landmark:true,
      classification:true,
      contour: false,
      faceTrack:true,
    };

    const me = this;
    document.getElementById('startCameraButton').innerText = 'TAKE PICTURE';

    window.faceDetection.start(options, function(result){
      //console.log('start' +JSON.stringify(result));

      const data = result.data;
      let htmlText = '';
      if(result.type == 'image'){
        document.getElementById('imageFrameTitle').innerHTML = 'Live frame information';

        htmlText += '<li>InputImage size: ' + data.imageSize; +' </li>';
        htmlText += '<li>FPS: ' + data.framesPerSecond +', Frame latency: ' + data.frameLatency +' </li>';
        htmlText += '<li>Detector latency: ' + data.detectorLatency +' </li>';
        document.getElementById('imageFrame').innerHTML = htmlText;
        return;
      }

      for(let i= 0; i < data.length; i++) {
        //console.log('face=' + JSON.stringify(data[i]));
        document.getElementById('faceFrameTitle').innerHTML = 'Detected faces information';

        htmlText += '<li>id:'+ data[i].id + ' , smiling:' + data[i].smiling +' </li>';
        htmlText += '<li>[EyeOpen]left: ' + data[i].leftEyeOpen +', right: ' + data[i].rightEyeOpen +'</li>';
        htmlText += '<li>[euler]X: ' + data[i].eulerX + ', Y: ' + data[i].eulerY + ', Z: ' + data[i].eulerZ +'</li>';
        htmlText += '<br>';
      }
      document.getElementById('faceFrame').innerHTML = htmlText;

    }, function(result){
      console.log('start camera error:' +result);
    });
    app.changeTakePicture(true);
  },

  changeTakePicture: function(change=true){
    if(change){
      document.getElementById('startCameraButton').removeEventListener('click', this.startCamera, false);
      document.getElementById('startCameraButton').addEventListener('click', this.takePicture, false);
    }else{
      document.getElementById('startCameraButton').removeEventListener('click', this.takePicture, false);
      document.getElementById('startCameraButton').addEventListener('click', this.startCamera, false);
    }
  },

  takePicture: function(){
    const options = {
      width: 360,
      height: 480,
      quality: 85,
    };

    window.faceDetection.takePicture(options, function(imageData){
      console.log('takePicture callback' +JSON.stringify(imageData));
      document.getElementById('originalPicture').style.backgroundColor = 'white';
      document.getElementById('originalPicture').style.backgroundImage = 'url(data:image/jpeg;base64,' + imageData + ')';
      app.stopCamera(true);
    });
  },

  stopCamera: function(flag=null){
    console.log('stopCamera:' + typeof flag);
    if('boolean' != typeof flag){
      document.getElementById('originalPicture').style.backgroundColor = 'gray';
      document.getElementById('originalPicture').style.backgroundImage = '';
    }

    window.faceDetection.stop();
    setTimeout(function(){
      document.getElementById('imageFrameTitle').innerHTML = '';
      document.getElementById('faceFrameTitle').innerHTML = '';

      document.getElementById('imageFrame').innerHTML = '';
      document.getElementById('faceFrame').innerHTML = '';

      document.getElementById('startCameraButton').innerText = 'START';
    }, 500);

    app.changeTakePicture(false);
  },

  init: function(){
    document.getElementById('startCameraButton').addEventListener('click', this.startCamera, false);
    document.getElementById('stopCameraButton').addEventListener('click', this.stopCamera, false);
  }
};

document.addEventListener('deviceready', function(){
  app.init();
}, false);
