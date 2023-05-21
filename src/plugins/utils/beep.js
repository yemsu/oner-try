class Beep {
  constructor(){ 
    this.myAudioContext = new AudioContext()
  }

  beep(duration, frequency, volume){
    return new Promise((resolve, reject) => {
      // Set default duration if not provided
      duration = duration || 200;
      frequency = frequency || 440;
      volume = volume || 2;
  
      try {
        const oscillatorNode = this.myAudioContext.createOscillator();
        const gainNode = this.myAudioContext.createGain();
        oscillatorNode.connect(gainNode);
  
        // Set the oscillator frequency in hertz
        oscillatorNode.frequency.value = frequency;
  
        // Set the type of oscillator
        oscillatorNode.type= "square";
        gainNode.connect(this.myAudioContext.destination);
  
        // Set the gain to the volume
        gainNode.gain.value = volume * 0.01;
  
        // Start audio with the desired duration
        oscillatorNode.start(this.myAudioContext.currentTime);
        oscillatorNode.stop(this.myAudioContext.currentTime + duration * 0.001);
  
        // Resolve the promise when the sound is finished
        oscillatorNode.onended = () => {
            resolve();
        };
      } catch(error) {
        reject(error);
      }
    })
  }
}
export default Beep
