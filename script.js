const fileInput = document.getElementById('file');
const gridContainer = document.querySelector('.grid-content');
const myAudio = document.querySelector('.audio-box')
const playButton = document.getElementById('playButton');
let audioContext, analyser;

fileInput.addEventListener('change', handleFile);
playButton.addEventListener('click', playAudio);

function handleFile(event) {
	const file = event.target.files[0];

	if (file) {
		const audio = new Audio(URL.createObjectURL(file));
		audio.controls = true;
		myAudio.appendChild(audio);

		audioContext = new (window.AudioContext || window.webkitAudioContext)();
		analyser = audioContext.createAnalyser();
		const source = audioContext.createMediaElementSource(audio);

		source.connect(analyser);
		analyser.connect(audioContext.destination);
	}
}

function playAudio() {
	if (audioContext) {
		analyser.fftSize = 256;
		const bufferLength = analyser.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);

		const canvas = document.createElement('canvas');
		canvas.width = gridContainer.clientWidth;
		canvas.height = gridContainer.clientHeight;
		const context = canvas.getContext('2d');
		gridContainer.innerHTML = '';
		gridContainer.appendChild(canvas);

		function draw() {
			analyser.getByteFrequencyData(dataArray);

			context.clearRect(0, 0, canvas.width, canvas.height);

			const barWidth = canvas.width / 6;
			const barHeight = canvas.height / 6;

			for (let row = 0; row < 6; row++) {
				for (let col = 0; col < 6; col++) {
					const index = Math.floor((row * 6 + col) / 36 * bufferLength);
					const value = dataArray[index];
					const normalizedValue = value / 256;  // Normalize to a value between 0 and 1

					context.fillStyle = `rgb(0, ${Math.floor(normalizedValue * 255)}, 0)`;
					context.fillRect(col * barWidth, row * barHeight, barWidth, barHeight);
				}
			}

			requestAnimationFrame(draw);
		}

		draw();
	}
}