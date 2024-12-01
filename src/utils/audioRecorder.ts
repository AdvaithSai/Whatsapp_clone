export class AudioRecorder {
    private mediaRecorder: MediaRecorder | null = null;
    private chunks: Blob[] = [];
  
    async startRecording(): Promise<void> {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);
        this.chunks = [];
  
        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            this.chunks.push(e.data);
          }
        };
  
        this.mediaRecorder.start();
      } catch (error) {
        console.error('Error starting recording:', error);
        throw error;
      }
    }
  
    stopRecording(): Promise<Blob> {
      return new Promise((resolve) => {
        if (!this.mediaRecorder) {
          throw new Error('MediaRecorder not initialized');
        }
  
        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.chunks, { type: 'audio/webm' });
          const tracks = this.mediaRecorder?.stream.getTracks();
          tracks?.forEach(track => track.stop());
          resolve(blob);
        };
  
        this.mediaRecorder.stop();
      });
    }
  }