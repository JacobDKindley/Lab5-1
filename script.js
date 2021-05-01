// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
var vol = 1.0;

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  var canvas = document.getElementById('user-image');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const activeButtons = document.getElementById('button-group');
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  document.querySelector("[type='reset']").disabled=true;
  document.querySelector("[type='button']").disabled=true;
  document.querySelector("[type='submit']").disabled=false;
  var dimensions = getDimmensions(canvas.width,canvas.height,img.width,img.height);
  ctx.drawImage(img,dimensions.startX,dimensions.startY,dimensions.width,dimensions.height);

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});
const fileChooser=document.getElementById('image-input');
fileChooser.addEventListener('change', () => {
  //Load selected image into the img var. set alt to file name
  var path = fileChooser.value;
  img.src=URL.createObjectURL(fileChooser.files[0]);
  fileChooser.setAttribute('alt',path.substring(path.lastIndexOf("\\")+1,path.lastIndexOf(".")));
});

const form=document.getElementById("generate-meme");
form.addEventListener('submit', function(event) {
  //draw
  var topText= document.getElementById('text-top').value;
  var botText= document.getElementById('text-bottom').value;
  var canvas = document.getElementById('user-image');
  var ctx = canvas.getContext('2d');
  ctx.font = "50px Arial";
  ctx.fillStyle="white";
  ctx.textAlign = "center";
  ctx.fillText(topText,canvas.width/2,50);
  ctx.fillText(botText,canvas.width/2,canvas.height-10);
  ctx.fillStyle="black";
  ctx.strokeText(topText,canvas.width/2,50);
  ctx.strokeText(botText,canvas.width/2,canvas.height-10);
  
  

  document.querySelector("[type='reset']").disabled=false;
  document.querySelector("[type='button']").disabled=false;
  document.querySelector("[type='submit']").disabled=true;
  event.preventDefault();
},false);

const clearButton = document.querySelector("[type='reset']");
clearButton.addEventListener('click', () =>{
  document.querySelector("[type='reset']").disabled=true;
  document.querySelector("[type='button']").disabled=true;
  document.querySelector("[type='submit']").disabled=false;
  img.src="";
  var canvas = document.getElementById('user-image');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);

});



const readButton = document.querySelector("[type='button']");
readButton.addEventListener('click', () => {
  var topText= document.getElementById('text-top').value;
  var botText= document.getElementById('text-bottom').value;
  let utterance = new SpeechSynthesisUtterance(topText + botText);
  const sel = document.getElementById("voice-selection");
  for(var i = 0; i < sel.options.length ; i++) {
    if(sel.options[i].name === sel.selectedOptions[0].name) {
      utterance.lang=sel.options[i].lang;
      break;
    }
  }
  
  utterance.volume=vol;  
  speechSynthesis.speak(utterance);
});

//Add all the voice options
function populateVoiceList(){
  let voices = speechSynthesis.getVoices();
  const sel = document.getElementById("voice-selection");
  sel.disabled=false;
  sel.options[0]=null;
  for(var i=0;i<voices.length;i++){
    var opt = document.createElement('option');
    opt.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    if(voices[i].default)opt.textContent += ' -- DEFAULT';
    opt.lang= voices[i].lang;
    opt.name = voices[i].name;
    sel.appendChild(opt);
  }
}

const slider = document.getElementById('volume-group');
slider.addEventListener('input', () => {
  var volume = slider.querySelector("[type='range']");
  var icon = slider.getElementsByTagName('img')[0];
  if(volume.value>=67){
    icon.src='icons\\volume-level-3.svg';
  }else if (volume.value >=34){
    icon.src='icons\\volume-level-2.svg';
  }else if(volume.value>=1){
    icon.src='icons\\volume-level-1.svg';
  }else{
    icon.src='icons\\volume-level-0.svg';
  }
  vol=volume.value/100;
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}

populateVoiceList();
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}
