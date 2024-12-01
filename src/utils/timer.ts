export class Timer {
    private startTime: number = 0;
    private timerInterval: NodeJS.Timeout | null = null;
    private onTick: (time: string) => void;
  
    constructor(onTick: (time: string) => void) {
      this.onTick = onTick;
    }
  
    start() {
      this.startTime = Date.now();
      this.timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        this.onTick(formattedTime);
      }, 1000);
    }
  
    stop() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }
  
    reset() {
      this.stop();
      this.startTime = 0;
    }
  }