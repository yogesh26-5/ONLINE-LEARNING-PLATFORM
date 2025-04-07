/**
 * StudyStream Custom Video Player
 * Creates a custom HTML5 video player with playback controls
 */

class CustomVideoPlayer {
  constructor(containerId, options) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.options = {
      src: '',
      title: '',
      ...options
    };
    
    // State
    this.isPlaying = false;
    this.isMuted = false;
    this.isFullScreen = false;
    this.volume = 1;
    this.currentTime = 0;
    this.duration = 0;
    this.controlsTimeout = null;
    
    // Initialize player
    this.init();
  }
  
  init() {
    // Create player structure
    this.createPlayerStructure();
    
    // Set up video element
    this.setupVideo();
    
    // Add event listeners
    this.addEventListeners();
    
    // Show loading state initially
    this.showLoading();
  }
  
  createPlayerStructure() {
    this.container.innerHTML = `
      <div class="video-player position-relative w-100 h-100 bg-black">
        <video class="w-100 h-100"></video>
        
        <!-- Loading Spinner -->
        <div class="loading-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-black bg-opacity-50">
          <div class="spinner-border text-white" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        
        <!-- Play Button Overlay -->
        <div class="play-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center cursor-pointer">
          <button class="btn btn-light rounded-circle p-3 play-btn">
            <i class="fa-solid fa-play fa-lg"></i>
          </button>
        </div>
        
        <!-- Video Controls -->
        <div class="video-controls position-absolute bottom-0 start-0 w-100 p-3">
          <div class="d-flex flex-column">
            <!-- Progress Bar -->
            <div class="progress mb-2" style="height: 5px; cursor: pointer;">
              <div class="progress-bar bg-primary" style="width: 0%"></div>
            </div>
            
            <!-- Controls Bar -->
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center">
                <button class="btn btn-link text-white p-1 play-pause-btn me-2">
                  <i class="fa-solid fa-play"></i>
                </button>
                
                <div class="d-none d-sm-flex align-items-center volume-container me-2">
                  <button class="btn btn-link text-white p-1 volume-btn">
                    <i class="fa-solid fa-volume-high"></i>
                  </button>
                  
                  <div class="volume-slider mx-2" style="width: 60px;">
                    <input type="range" class="form-range" min="0" max="100" value="100">
                  </div>
                </div>
                
                <span class="text-white small time-display">0:00 / 0:00</span>
              </div>
              
              <button class="btn btn-link text-white p-1 fullscreen-btn">
                <i class="fa-solid fa-expand"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Get player elements
    this.player = this.container.querySelector('.video-player');
    this.video = this.container.querySelector('video');
    this.loadingOverlay = this.container.querySelector('.loading-overlay');
    this.playOverlay = this.container.querySelector('.play-overlay');
    this.playBtn = this.container.querySelector('.play-btn');
    this.controls = this.container.querySelector('.video-controls');
    this.progressBar = this.container.querySelector('.progress');
    this.progressBarFill = this.container.querySelector('.progress-bar');
    this.playPauseBtn = this.container.querySelector('.play-pause-btn');
    this.volumeBtn = this.container.querySelector('.volume-btn');
    this.volumeSlider = this.container.querySelector('.volume-slider input');
    this.timeDisplay = this.container.querySelector('.time-display');
    this.fullscreenBtn = this.container.querySelector('.fullscreen-btn');
  }
  
  setupVideo() {
    // Set video source
    this.video.src = this.options.src || 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4';
    
    // Set poster image if available
    if (this.options.poster) {
      this.video.poster = this.options.poster;
    }
    
    // Set title if provided
    if (this.options.title) {
      this.video.title = this.options.title;
    }
    
    // Load video
    this.video.load();
  }
  
  addEventListeners() {
    // Video events
    this.video.addEventListener('loadedmetadata', () => this.handleMetadata());
    this.video.addEventListener('timeupdate', () => this.handleTimeUpdate());
    this.video.addEventListener('waiting', () => this.showLoading());
    this.video.addEventListener('canplay', () => this.hideLoading());
    this.video.addEventListener('ended', () => this.handleEnded());
    
    // Player control events
    this.playOverlay.addEventListener('click', () => this.togglePlay());
    this.playPauseBtn.addEventListener('click', () => this.togglePlay());
    this.volumeBtn.addEventListener('click', () => this.toggleMute());
    this.volumeSlider.addEventListener('input', (e) => this.handleVolumeChange(e));
    this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    this.progressBar.addEventListener('click', (e) => this.handleProgressBarClick(e));
    
    // Mouse movement to show/hide controls
    this.player.addEventListener('mousemove', () => this.handleMouseMove());
    this.player.addEventListener('mouseleave', () => {
      if (this.isPlaying) {
        this.hideControls();
      }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    
    // Fullscreen change
    document.addEventListener('fullscreenchange', () => {
      this.isFullScreen = !!document.fullscreenElement;
      this.updateFullscreenButton();
    });
  }
  
  handleMetadata() {
    this.duration = this.video.duration;
    this.updateTimeDisplay();
    this.hideLoading();
  }
  
  handleTimeUpdate() {
    this.currentTime = this.video.currentTime;
    
    // Update progress bar
    const progress = (this.currentTime / this.duration) * 100;
    this.progressBarFill.style.width = `${progress}%`;
    
    // Update time display
    this.updateTimeDisplay();
    
    // Fire onProgress callback if provided
    if (this.options.onProgress) {
      this.options.onProgress(this.currentTime, this.duration);
    }
    
    // Check if video is almost complete (95%)
    if (this.currentTime > this.duration * 0.95) {
      // Fire onComplete callback if provided
      if (this.options.onComplete && !this.completeFired) {
        this.options.onComplete();
        this.completeFired = true;
      }
    }
  }
  
  handleEnded() {
    this.isPlaying = false;
    this.updatePlayPauseButton();
    this.showPlayOverlay();
    
    // Fire onComplete callback if not already fired
    if (this.options.onComplete && !this.completeFired) {
      this.options.onComplete();
      this.completeFired = true;
    }
  }
  
  showLoading() {
    if (this.loadingOverlay) {
      this.loadingOverlay.classList.remove('d-none');
    }
  }
  
  hideLoading() {
    if (this.loadingOverlay) {
      this.loadingOverlay.classList.add('d-none');
    }
  }
  
  togglePlay() {
    if (this.video.paused || this.video.ended) {
      this.play();
    } else {
      this.pause();
    }
  }
  
  play() {
    this.video.play()
      .then(() => {
        this.isPlaying = true;
        this.updatePlayPauseButton();
        this.hidePlayOverlay();
        
        // Auto-hide controls after a delay
        setTimeout(() => {
          if (this.isPlaying) {
            this.hideControls();
          }
        }, 3000);
      })
      .catch(error => {
        console.error('Error playing video:', error);
      });
  }
  
  pause() {
    this.video.pause();
    this.isPlaying = false;
    this.updatePlayPauseButton();
    this.showPlayOverlay();
    this.showControls();
  }
  
  updatePlayPauseButton() {
    if (this.playPauseBtn) {
      this.playPauseBtn.innerHTML = this.isPlaying
        ? '<i class="fa-solid fa-pause"></i>'
        : '<i class="fa-solid fa-play"></i>';
    }
  }
  
  showPlayOverlay() {
    if (this.playOverlay) {
      this.playOverlay.classList.remove('d-none');
    }
  }
  
  hidePlayOverlay() {
    if (this.playOverlay) {
      this.playOverlay.classList.add('d-none');
    }
  }
  
  toggleMute() {
    this.isMuted = !this.isMuted;
    this.video.muted = this.isMuted;
    
    if (this.isMuted) {
      this.volumeSlider.value = 0;
    } else {
      this.volumeSlider.value = this.volume * 100;
      this.video.volume = this.volume;
    }
    
    this.updateVolumeButton();
  }
  
  handleVolumeChange(event) {
    const volumeValue = event.target.value / 100;
    this.volume = volumeValue;
    this.video.volume = volumeValue;
    
    // Update muted state
    this.isMuted = volumeValue === 0;
    this.video.muted = this.isMuted;
    
    this.updateVolumeButton();
  }
  
  updateVolumeButton() {
    if (!this.volumeBtn) return;
    
    if (this.isMuted || this.volume === 0) {
      this.volumeBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    } else if (this.volume < 0.5) {
      this.volumeBtn.innerHTML = '<i class="fa-solid fa-volume-low"></i>';
    } else {
      this.volumeBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    }
  }
  
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      if (this.player.requestFullscreen) {
        this.player.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
  
  updateFullscreenButton() {
    if (this.fullscreenBtn) {
      this.fullscreenBtn.innerHTML = this.isFullScreen
        ? '<i class="fa-solid fa-compress"></i>'
        : '<i class="fa-solid fa-expand"></i>';
    }
  }
  
  handleProgressBarClick(event) {
    const rect = this.progressBar.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    this.video.currentTime = pos * this.video.duration;
  }
  
  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }
  
  updateTimeDisplay() {
    if (this.timeDisplay) {
      this.timeDisplay.textContent = `${this.formatTime(this.currentTime)} / ${this.formatTime(this.duration)}`;
    }
  }
  
  handleMouseMove() {
    this.showControls();
    
    // Clear any existing timeout
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
    }
    
    // Auto-hide controls after a delay if playing
    if (this.isPlaying) {
      this.controlsTimeout = setTimeout(() => {
        this.hideControls();
      }, 3000);
    }
  }
  
  showControls() {
    if (this.controls) {
      this.controls.classList.add('visible');
    }
  }
  
  hideControls() {
    if (this.controls) {
      this.controls.classList.remove('visible');
    }
  }
  
  handleKeyPress(event) {
    // Only handle keypress if this player is in view
    const rect = this.player.getBoundingClientRect();
    const isInView = (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
    
    if (!isInView) return;
    
    switch (event.key) {
      case ' ':
      case 'k':
        this.togglePlay();
        event.preventDefault();
        break;
      case 'm':
        this.toggleMute();
        event.preventDefault();
        break;
      case 'f':
        this.toggleFullscreen();
        event.preventDefault();
        break;
      case 'ArrowRight':
        this.video.currentTime += 10;
        event.preventDefault();
        break;
      case 'ArrowLeft':
        this.video.currentTime -= 10;
        event.preventDefault();
        break;
      case 'ArrowUp':
        this.volume = Math.min(1, this.volume + 0.1);
        this.volumeSlider.value = this.volume * 100;
        this.video.volume = this.volume;
        this.isMuted = false;
        this.video.muted = false;
        this.updateVolumeButton();
        event.preventDefault();
        break;
      case 'ArrowDown':
        this.volume = Math.max(0, this.volume - 0.1);
        this.volumeSlider.value = this.volume * 100;
        this.video.volume = this.volume;
        this.isMuted = this.volume === 0;
        this.video.muted = this.isMuted;
        this.updateVolumeButton();
        event.preventDefault();
        break;
    }
  }
}
