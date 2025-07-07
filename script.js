  const uploadBtn = document.getElementById('uploadBtn');
        const fileUpload = document.getElementById('fileUpload');
        const trackList = document.getElementById('trackList');
        const nowPlaying = document.getElementById('nowPlaying');
        const artistName = document.getElementById('artistName');
        const playBtn = document.getElementById('playBtn');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const progressBar = document.getElementById('progressBar');
        const currentTimeDisplay = document.getElementById('currentTime');
        const totalTimeDisplay = document.getElementById('totalTime');
        const albumArt = document.getElementById('albumArt');

        let audio = new Audio();
        let currentTrackIndex = -1;
        let tracks = [];

        uploadBtn.addEventListener('click', () => {
            fileUpload.click();
        });

        fileUpload.addEventListener('change', (event) => {
            const files = Array.from(event.target.files);
            files.forEach(file => {
                const track = {
                    name: file.name,
                    url: URL.createObjectURL(file)
                };
                tracks.push(track);
                addTrackToPlaylist(track);
            });
            if (tracks.length > 0) {
                currentTrackIndex = 0;
                loadTrack(currentTrackIndex);
            }
        });

        function addTrackToPlaylist(track) {
            const li = document.createElement('li');
            li.textContent = track.name;
            li.className = 'cursor-pointer hover:bg-gray-100 p-2 rounded';
            li.addEventListener('click', () => {
                currentTrackIndex = tracks.indexOf(track);
                loadTrack(currentTrackIndex);
            });
            trackList.appendChild(li);
        }

        function loadTrack(index) {
            if (index < 0 || index >= tracks.length) return;
            audio.src = tracks[index].url;
            nowPlaying.textContent = tracks[index].name;
            artistName.textContent = "Unknown Artist"; // You can modify this to extract artist info if available
            audio.load();
            playBtn.disabled = false;
            prevBtn.disabled = index === 0;
            nextBtn.disabled = index === tracks.length - 1;
            audio.play();
            updateProgressBar();
        }

        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                playBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
            } else {
                audio.pause();
                playBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentTrackIndex > 0) {
                currentTrackIndex--;
                loadTrack(currentTrackIndex);
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentTrackIndex < tracks.length - 1) {
                currentTrackIndex++;
                loadTrack(currentTrackIndex);
            }
        });

        audio.addEventListener('timeupdate', updateProgressBar);
        audio.addEventListener('ended', () => {
            if (currentTrackIndex < tracks.length - 1) {
                currentTrackIndex++;
                loadTrack(currentTrackIndex);
            }
        });

        function updateProgressBar() {
            const progress = (audio.currentTime / audio.duration) * 100 || 0;
            progressBar.value = progress;
            currentTimeDisplay.textContent = formatTime(audio.currentTime);
            totalTimeDisplay.textContent = formatTime(audio.duration);
        }

        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        }

        progressBar.addEventListener('input', (event) => {
            const value = event.target.value;
            audio.currentTime = (value / 100) * audio.duration;
        });