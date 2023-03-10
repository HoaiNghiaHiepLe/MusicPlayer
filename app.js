const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "ADMIN_PLAYER";

const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playList = $(".playlist");
const displayCurrentTime = $(".current-time");
const displayDurationTime = $(".duration-time");
const volumeControl = $(".volume-control");
const volumeRange = $("#volumeRange");
const volumeBtn = $(".btn-volume");
const volumeIndicator = document.createElement("div");
volumeIndicator.classList.add("volume-indicator");
volumeControl.appendChild(volumeIndicator);

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songList: [
    {
      name: "Forever to Run",
      composer: "Howard Harper-Barnes",
      path: "./assets/music/ES_Forever to Run - Howard Harper-Barnes.mp3",
      image: "./assets/img/ES_Forever to Run.jpg",
    },
    {
      name: "Sosso",
      composer: "Magnus Ludvigsson",
      path: "./assets/music/ES_Sosso - Magnus Ludvigsson.mp3",
      image: "./assets/img/ES_Sosso.jpg",
    },
    {
      name: "The Big Chase",
      composer: "Bonnie Grace",
      path: "./assets/music/ES_The Big Chase - Bonnie Grace.mp3",
      image: "./assets/img/ES_The Big Chase.jpg",
    },
    {
      name: "If you fall i will carry you",
      composer: "Efisio Cross",
      path: "./assets/music/If you fall i will carry you.mp3",
      image: "./assets/img/If you fall i will carry you.jpg",
    },
    {
      name: "Icarus",
      composer: "Ivan Torrent Ft Julie Elven",
      path: "./assets/music/Icarus_(feat._Julie_Elven).mp3",
      image: "./assets/img/Icarus.jpg",
    },
    {
      name: "Sold Out",
      composer: "Hawk Nelson",
      path: "./assets/music/Hawk Nelson - Sold Out.mp3",
      image: "./assets/img/Hawk Nelson - Sold Out.jpg",
    },
    {
      name: "Phong d??? h??nh",
      composer: "BT X LVT REMIX",
      path: "./assets/music/PHONG D??? H??NH -BT X LVT REMIX.mp3",
      image: "./assets/img/PHONG D??? H??NH -BT X LVT REMIX.jpg",
    },
    {
      name: "Feel The Love",
      composer: "Janieck - (Sam Feldt Edit)",
      path: "./assets/music/Janieck - Feel The Love (Sam Feldt Edit).mp3",
      image: "./assets/img/Janieck - Feel The Love (Sam Feldt Edit).jpg",
    },
    {
      name: "Set Fire To The Rain",
      composer: "Adele",
      path: "./assets/music/Set Fire To The Rain  Adele.mp3",
      image: "./assets/img/Set Fire To The Rain  Adele.jpg",
    },
    {
      name: "Thuy???n Quy??n",
      composer: "(AM Remix) - Di???u Ki??n",
      path: "./assets/music/Thuy???n Quy??n (AM Remix) - Di???u Ki??n.mp3",
      image: "./assets/img/Thuy???n Quy??n (AM Remix) - Di???u Ki??n.jpg",
    },
  ],
  formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    return `${minutes}:${seconds}`;
  },
  setConfig(key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render() {
    const htmls = this.songList.map((song, index) => {
      return `
          <div class="song ${
            index === this.currentIndex && "active"
          }" data-index="${index}">
          <div
            class="thumb"
            style="
              background-image: url('${song.image}');
            "
          ></div>
          <div class="body">
            <h3 class="title">${song.name.toUpperCase()}</h3>
            <p class="author">${song.composer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
            `;
    });
    playList.innerHTML = htmls.join("");
  },
  defineProperties() {
    Object.defineProperty(this, "currentSong", {
      get() {
        return this.songList[this.currentIndex];
      },
    });
  },
  handleEvent() {
    const cdWidth = cd.offsetWidth;
    // handle Cd rotate
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();
    // zoom in cd
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };
    // handle click play Btn
    playBtn.onclick = () => {
      if (app.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    // while playing
    audio.onplay = () => {
      app.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
      app.setConfig("currentIndex", app.currentIndex);
      app.setConfig("seekTime", audio.currentTime);
    };
    // while pausing
    audio.onpause = () => {
      app.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
      app.setConfig("currentIndex", app.currentIndex);
      app.setConfig("seekTime", audio.currentTime);
    };
    // playing progress bar
    audio.ontimeupdate = () => {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
        progress.style.setProperty(
          "--current-percentage",
          `${progressPercent}%`
        );
        displayCurrentTime.innerHTML = app?.formatTime(audio?.currentTime);
        displayDurationTime.innerHTML = app?.formatTime(audio?.duration);
      }
      app.setConfig("currentIndex", app.currentIndex);
      app.setConfig("seekTime", audio.currentTime);
    };
    // handle seeking song
    progress.oninput = (e) => {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };
    // handle click next song Btn
    nextBtn.onclick = () => {
      if (app.isRandom) {
        app.playRandomSong();
      } else {
        app.nextSong();
      }
      audio.play();
      app.render();
      app.scrollToActiveSong();
    };
    // handle click prev song Btn
    prevBtn.onclick = () => {
      if (app.isRandom) {
        app.playRandomSong();
      } else {
        app.prevSong();
      }
      audio.play();
      app.render();
      app.scrollToActiveSong();
    };
    // handle toggle click random song Btn
    randomBtn.onclick = () => {
      app.isRandom = !app.isRandom;
      app.isRepeat = false;
      app.setConfig("isRandom", app.isRandom);
      app.setConfig("isRepeat", app.isRepeat);
      randomBtn.classList.toggle("active", app.isRandom);
      app.loadConfig();
    };
    // handle toggle click repeat song Btn
    repeatBtn.onclick = () => {
      app.isRepeat = !app.isRepeat;
      app.isRandom = false;
      app.setConfig("isRandom", app.isRandom);
      app.setConfig("isRepeat", app.isRepeat);
      repeatBtn.classList.toggle("active", app.isRepeat);
      app.loadConfig();
    };
    // handle next song on audio ended
    audio.onended = () => {
      if (app.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
      app.setConfig("currentIndex", app.currentIndex);
      app.setConfig("seekTime", 0);
    };
    // add event listenter click on PlayList
    playList.onclick = (e) => {
      const songNode = e.target.closest(".song:not(.active)");
      // handle when click on song
      if (songNode || e.target.closest(".option")) {
        if (songNode) {
          app.currentIndex = Number(songNode.dataset.index);
          app.loadCurrentSong();
          audio.play();
          app.render();
        }
      }
    };
    // handle volume control
    volumeRange.oninput = (e) => {
      const currentVolume = e.target.value / 100;
      audio.volume = currentVolume;
      volumeRange.style.setProperty(
        "--current-percentage",
        `${Math.floor(currentVolume * 100)}%`
      );
      if (currentVolume === 0) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
        app.setConfig("currentVolume", 0);
      } else {
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        app.setConfig("currentVolume", currentVolume);
      }
    };
    // handle show volume value
    volumeRange.addEventListener("input", (e) => {
      volumeControl.style.position = "relative";
      volumeControl.style.marginBottom = "16px";
      volumeIndicator.style.position = "absolute";
      volumeIndicator.style.color = "#666666";
      volumeIndicator.style.fontSize = "14px";
      volumeIndicator.innerHTML = `${e.target.value}%`;
      const rangeWidth = volumeRange.offsetWidth;
      const thumbHeight = volumeRange.offsetHeight;
      const offset =
        (e.target.value / 100) * (rangeWidth - thumbHeight / 2) + 130;
      volumeIndicator.style.left = `${offset}px`;
      volumeIndicator.style.top = `${
        e.target.offsetTop - volumeIndicator.offsetHeight / 2 + 20
      }px`;
      volumeIndicator.style.opacity = 1;
    });
    volumeRange.addEventListener("mouseout", () => {
      volumeControl.style.marginBottom = "0px";
      volumeIndicator.style.opacity = 0;
    });
    // handle mute
    volumeBtn.onclick = () => {
      if (audio.volume > 0) {
        // Mute the audio
        app.setConfig("lastModifierVolume", audio.volume); // Save the current volume
        audio.volume = 0;
        app.setConfig("currentVolume", audio.volume); // Save the current volume
        volumeRange.value = 0;
        volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
        volumeRange.style.setProperty(
          "--current-percentage",
          `${Math.floor(0)}%`
        );
      } else {
        // Unmute the audio and set the volume back to the last value
        audio.volume = app.config.lastModifierVolume || 1;
        app.setConfig("currentVolume", audio.volume); // Save the current volume
        // Set the volume back to the last value or to 100% if no value is saved
        volumeRange.value = audio.volume * 100;
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        volumeRange.style.setProperty(
          "--current-percentage",
          `${Math.floor(audio.volume * 100)}%`
        );
      }
    };
  },
  // handle scroll to active song
  scrollToActiveSong() {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: app.currentIndex === 0 ? "center" : "nearest",
      });
    }, 300);
  },
  loadCurrentSong() {
    heading.textContent = this.currentSong.name.toLowerCase();
    cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
    audio.src = this.currentSong.path;
  },
  loadConfig() {
    if (this.config.isRandom || this.config.isRepeat) {
      app.isRandom = this.config.isRandom;
      app.isRepeat = this.config.isRepeat;
    } else {
      app.isRandom = false;
      app.isRepeat = false;
      audio.volume = 1;
    }
    app.playedSongs = this.config.playedSongs;
    randomBtn.classList.toggle("active", app.isRandom);
    repeatBtn.classList.toggle("active", app.isRepeat);
  },
  loadStoredSong() {
    this.currentIndex = this.config.currentIndex || 0;
    audio.currentTime = this.config.seekTime || 0;
    volumeRange.value = this.config.currentVolume * 100;
    volumeRange.style.setProperty(
      "--current-percentage",
      `${Math.floor(this.config.currentVolume * 100)}%`
    );
    if (this.config.currentVolume === 0) {
      volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
      audio.volume = 0;
    } else {
      volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
      audio.volume = app.config.currentVolume || 1;
    }
  },
  nextSong() {
    this.currentIndex++;
    if (this.currentIndex >= this.songList.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong() {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songList.length - 1;
    }
    this.loadCurrentSong();
  },
  // handle play random songs
  playRandomSong() {
    const playedSongs = app.config.playedSongs || [];
    let randomSong;

    if (playedSongs.length === app.songList.length) {
      playedSongs.length = 0; // reset the playedSongs array
    }

    do {
      randomSong = Math.floor(Math.random() * app.songList.length);
    } while (playedSongs.includes(randomSong));

    playedSongs.push(randomSong);
    app.setConfig("playedSongs", playedSongs);
    app.currentIndex = randomSong;
    app.loadCurrentSong();
  },
  start() {
    this.loadConfig();
    this.loadStoredSong();
    this.defineProperties();
    this.handleEvent();
    this.loadCurrentSong();
    this.render();
  },
};
app.start();
