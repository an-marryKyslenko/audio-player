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
		console.log(context);
		gridContainer.innerHTML = '';
		gridContainer.appendChild(canvas);

		function draw() {
			analyser.getByteFrequencyData(dataArray);

			context.clearRect(0, 0, canvas.width, canvas.height);

			const barWidth = canvas.width / bufferLength;
			let barHeight, x = 0;

			for (let i = 0; i < bufferLength; i++) {
				barHeight = dataArray[i] / 2;

				context.fillStyle = `rgb(0, ${barHeight}, 0)`;
				context.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

				x += barWidth + 1;
			}

			requestAnimationFrame(draw);
		}

		draw();
	}
}