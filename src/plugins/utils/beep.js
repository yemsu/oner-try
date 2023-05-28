class Beep {
  constructor(isMuted, volume){ 
    this.audioUrl = `${process.env.BASE_URL}/audio/`
    this.audios = {
      chopa1: new Audio(`${this.audioUrl}chopa-1.mp3`),
      chopa2: new Audio(`${this.audioUrl}chopa-2.mp3`),
      jigun: new Audio(`${this.audioUrl}jigun.mp3`)
    },
    this.isMuted = isMuted || false
    this.volumeGap = 0.125
    this.volume = volume || 0.25
    this.selectedAudio = 'jigun'

    this.init()
  }
  init() {
    this.setAudioVolume()
  }
  setAudioVolume() {
    for(const key in this.audios) {
      this.audios[key].volume = this.volume
    }
  }
  changeVolume() {
    this.setVolume()
    this.setAudioVolume()
    if(this.isMuted) this.setMuted(false)
    this.beep()
  }
  setVolume() {
    this.volume = this.volume >= 0.5
      ? this.volumeGap
      : this.volume + this.volumeGap
    localStorage.setItem('ONER_TRY_CHAT_VOLUME', `${this.volume}`)
  }
  setMuted(isMuted) {
    this.isMuted = isMuted
    localStorage.setItem('ONER_TRY_CHAT_MUTED', `${isMuted}`)
  }
  toggleMuted() {
    this.setMuted(!this.isMuted)
  }
  beep(selectedAudio){
    if(this.isMuted) return
    const audioName = selectedAudio || this.selectedAudio
    this.audios[audioName].pause()
    this.audios[audioName].currentTime = 0  
    this.audios[audioName].play();
    return
  }
  bitBeep(duration, frequency, volume) {
    // this.Beep.beep(50, 250, 2);
    // setTimeout(() => {
    //   this.Beep.beep(50, 280, 2)
    // }, 150)
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
