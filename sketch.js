let ready = false; 
let isPlaying = false;

let osc;  
let osc2; 
let waveform; 

let gui; 

//----------------------------------------------------
function setup() { 
  createCanvas(windowWidth, windowHeight); 
  
  // Set up button event listeners
  document.getElementById('startBtn').addEventListener('click', startAudio);
  document.getElementById('stopBtn').addEventListener('click', stopAudio);
}

//----------------------------------------------------
function startAudio() {
  if (!ready) {
    ready = true;
    initializeAudio();
  }
  
  if (!isPlaying) {
    isPlaying = true;
    // Resume audio context if suspended
    if (Tone.context.state !== 'running') {
      Tone.context.resume();
    }
    
    if (osc && osc2) {
      osc.start();
      osc2.start();
    }
  }
}

//----------------------------------------------------
function stopAudio() {
  if (isPlaying) {
    isPlaying = false;
    
    if (osc && osc2) {
      osc.stop();
      osc2.stop();
    }
  }
}

//----------------------------------------------------
function initializeAudio() {
  
  osc = new Tone.Oscillator();
  osc.type = "sine"; // triangle, square or sawtooth
  osc.frequency.value = 220;  // hz
  // Don't start automatically, wait for button press
  osc.toDestination();  // connect the oscillator to the audio output
  
  osc2 = new Tone.Oscillator();
  osc2.type = "sine"; // triangle, square or sawtooth
  osc2.frequency.value = 220;  // hz
  // Don't start automatically, wait for button press
  osc2.toDestination();  // connect the oscillator to the audio output
  
  let lfo = new Tone.LFO(0.1, 200, 240);
  lfo.connect(osc2.frequency);
  lfo.start();
  
  waveform = new Tone.Waveform();
  Tone.Master.connect(waveform);
  Tone.Master.volume.value = -9; // -9 decibels  
  
  let oscType = ["sine", "triangle", "square", "sawtooth"];
  
  gui = new dat.GUI();
  gui.add(osc.frequency, "value", 110, 330).step(0.1).name("frequency");
  gui.add(osc, "type", oscType).name("osc1 type");
  gui.add(osc2, "type", oscType).name("osc2 type");
  
  // Start playing after initialization
  startAudio();
}

//----------------------------------------------------
function draw() {  
  if (ready) {
    // our main sketch
    background(0, 20);
    stroke('#00FFDD'); // Neon teal
    fill('#FF00FF'); // Neon pink with some transparency
    
    let buffer = waveform.getValue(0); // grab the left channel 
    
    let start = 0; 
    for (let i=1; i < buffer.length; i++) {
      if (buffer[i-1] < 0 && buffer[i] >= 0) {
        start = i;
        break; // interrupts the for loop 
      }
    }
    let end = buffer.length/2 + start; 
    
    beginShape();
    for (let i=start; i < end; i++) {      
      let x = map(i, start, end, 0, width);
      let y = map(buffer[i], -1, 1, 0, height);      
      vertex(x, y);
    }
    vertex(width, height); // bottom right
    vertex(0, height); // bottom left
    endShape(CLOSE);
        
  }
  else {
    background('black'); 
    fill('#00FFDD'); // Neon teal
    textAlign(CENTER, CENTER);
    text("CLICK START TO BEGIN!", width/2, height/2);
  }  
}

//----------------------------------------------------
function mousePressed() {
  // Now using buttons instead of mouse clicks to start
  if (mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height) {
    // Only allow canvas interactions, not starting/stopping
  }
}