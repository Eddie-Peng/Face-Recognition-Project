(function($){
  'use strict';
  
  /**
   * Constructor
   */
  var Video = function($element) {
    
    /**
     * Make the reference to the passed
     * in element globally accessible within
     * the Video constructor
     */
    this.$element = $element;
    
    /**
     * Kick off the application
     */
    this.init();
  };
  
  /* Alias prototype */ 
  var proto = Video.prototype;
  
  /**
   * Top level function
   */
  proto.init = function() {
    
    return this.setupHandlers()
               .createChildren()
               .enable();
  };
  
  /**
   * Used to bind 'this' for functions
   */
  proto.setupHandlers = function() {
    this.onPlayPauseHandler = this.playPause.bind(this);
    this.onMuteHandler = this.mute.bind(this);
    this.onTimeUpdateHandler = this.progress.bind(this);
    this.onSeekHandler = this.seek.bind(this);
    this.onFullscreenHandler = this.fullscreenMode.bind(this);
    this.onVolumeHandler = this.adjustVolume.bind(this);

   
    return this;
  };
  
  /**
   * Create jQuery selectors here
   */
  proto.createChildren = function() {
    this.$video = this.$element.find('.js-media');
    this.$media = this.$video[0];
    this.$playBtn = this.$element.find('[data-playPause]');
    this.$muteBtn = this.$element.find('[data-mute]');
    this.$volume = this.$element.find('[data-volume]');
    this.$timeBar = this.$element.find('[data-time]');
    this.$bufferBar = this.$element.find('[data-buffer]');
    this.$progress = this.$element.find('[data-progress]');
    this.$currentTime = this.$element.find('[data-currentTime]');
    this.$duration = this.$element.find('[data-duration]');
    this.$fullscreen = this.$element.find('[data-fullscreen]');
    
    return this;
  };
  
  /**
   * Event listeners and functions that need
   * to run on initialization 
   */
  proto.enable = function() {
    this.$playBtn.on('click', this.onPlayPauseHandler);
    this.$muteBtn.on('click', this.onMuteHandler);
    this.$video.on('timeupdate', this.onTimeUpdateHandler)
                .on('loadedmetadata', function() {
                      this.updateTimeDisplay(0, this.$media.duration);
                    }.bind(this))
                .on('ended', function() {
                      this.$playBtn.removeClass('fa-play fa-pause')
                                   .addClass('fa-undo');
                      this.updateTime(100);
                    }.bind(this))
                ;
    this.$progress.on('mousedown', this.onSeekHandler)
                  .on('mouseup', this.onSeekHandler);
    this.$fullscreen.on('click', this.onFullscreenHandler);
    this.$volume.on('volumeChange', this.onVolumeHandler);
    
    return this;
  };
  
  /**
   * Get New Location
   *
   * Uses offsets within the tracking bar
   * to find the position in seconds that the
   * corresponds to in seconds of the video.
   *
   * Returns an object that has the new position 
   * of the seek bar and the actual time time 
   * seconds
   */
  proto.getNewLocation = function(e) {
    var seekBarOffset = this.$progress.offset().left;
    var mouseOffset = e.pageX;
    var mousePosInBar = mouseOffset - seekBarOffset;
    var seekBarWidth = this.$progress.width();
    var duration = this.$media.duration;
    var dist = Math.floor((mousePosInBar / seekBarWidth) * 100);
    var actualSeconds = (dist / 100) * duration;
    var newLocation = (actualSeconds/duration) * 100;
    
    var info = {
      newTime: newLocation,
      actualTime: actualSeconds
    };;
    
    return info;
  };
  
  /**
   * Seek
   *
   * Called on mousedown and mouseup in the progress bar
   * to set the position of the progress bar and time in the
   * video.
   */
  proto.seek = function(e) {
    var info = this.getNewLocation(e);
    this.$media.currentTime = info.actualTime; // Set the time
    this.updateTime(info.newTime);
  };
  
  /**
   * Play
   *
   * Plays or pauses the video
   */
  proto.playPause = function() {
    if (this.$media.paused) {
      this.play();
    } else {
      this.pause();
    }
  };
  
  proto.play = function() {
    this.$media.play();
    this.$playBtn.removeClass('fa-play fa-undo')
    .addClass('fa-pause');
  };
  proto.pause = function() {
    this.$media.pause();
    this.$playBtn.removeClass('fa-pause fa-undo')
    .addClass('fa-play');
  };

  
  /**
   * Mute 
   *
   * Mutes the video
   */
  proto.mute = function() {
    if (this.$media.muted) {
      this.$media.muted = false;
    } else {
      this.$media.muted = true;
    }
    
    this.muteIconSwap();
  };
  
  proto.muteIconSwap = function() {
    if (this.$media.muted) {
      this.$muteBtn.removeClass('fa-volume-up')
                   .addClass('fa-volume-off');
    } else {
      this.$muteBtn.removeClass('fa-volume-off')
                   .addClass('fa-volume-up');
    }
  };
  
  /**
   * Volume 
   *
   * Volume of the video
   */
  proto.adjustVolume = function() {
    var toVolume = this.$volume.data('volume') / 100;
    this.$media.volume = toVolume; // from 0 - 1
    if(toVolume === 0) {
      this.$media.muted = true;
    } else {
      this.$media.muted = false;
    }
    this.muteIconSwap();
  }

  /**
   * Progress
   *
   * 
   */
  proto.progress = function() {
    var currentTime = Math.round(this.$media.currentTime);
    var duration = this.$media.duration;
    var locationPercent = (currentTime/duration) * 100;
    var buffered = this.$media.buffered.end(0);
    var bufferPercent = Math.floor((buffered/duration) * 100);

    this.updateTime(locationPercent);
    this.updateBuffer(bufferPercent);
    this.updateTimeDisplay(Math.floor(this.$media.currentTime), duration);

  };
  
  /**
   * Update Buffer
   *
   * Updates the width of the buffer bar.
   */
  proto.updateBuffer = function(percent) {
    this.$bufferBar.css('width', percent + '%');
  };
  
  /**
   * Update Time
   *
   * Updates the width of the seek bar.
   */
  proto.updateTime = function(percent) {
    this.$timeBar.css('width', percent + '%');
  };

  proto.updateTimeDisplay = function(currentTime, duration) {
    this.$currentTime.text(formatTime(currentTime));
    this.$duration.text(formatTime(duration));
  }
  
  function formatTime(s, m) {
      s = Math.floor( s );    
      m = Math.floor( s / 60 );
      m = m >= 10 ? m : '0' + m;    
      s = Math.floor( s % 60 );
      s = s >= 10 ? s : '0' + s;    
      return m + ':' + s;
  }
  
   /**
   * Full screen
   *
   * Display video in fullscreen mode
   */
  proto.fullscreenMode = function() {
    var elem = this.$media;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  }
  
  /**
   * Update src 
   *
   * Update src of the video and reload
   */
  proto.updateSrc = function(newSource, poster) {
    var source = this.$video.find('source');
    $(source).attr('src', newSource);
    if(poster) {
      this.$video.attr('poster', poster);
    }
    this.$media.load();
  }
  
  
  // making it a jQuery plugin
  $.fn.video = function() {
    return this.each(function() {
      $(this).data('Video', new Video($(this)));
    });
  }


})(jQuery);

// embedabled movies https://www.davestrailerpage.co.uk/


// use jQuery UI slider for volume control
if($.fn.slider) {
  
  $('.volumeControl').slider({
    min: 0,
    max: 100,
    value: 100,
    slide: function( event, ui ) {
      $(this).data('volume', ui.value).trigger('volumeChange');
    }
  });
}

// Initialize the Video instance
$('.js-video').video();