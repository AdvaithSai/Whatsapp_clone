export class MediaStreamManager {
    private stream: MediaStream | null = null;
  
    async startCamera(): Promise<MediaStream> {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        return this.stream;
      } catch (error) {
        console.error('Error accessing camera:', error);
        throw error;
      }
    }
  
    stopCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
      }
    }
  
    toggleVideo(enabled: boolean) {
      if (this.stream) {
        this.stream.getVideoTracks().forEach(track => {
          track.enabled = enabled;
        });
      }
    }
  
    toggleAudio(enabled: boolean) {
      if (this.stream) {
        this.stream.getAudioTracks().forEach(track => {
          track.enabled = enabled;
        });
      }
    }
  }