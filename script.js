function startGame() {
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('stage-1').classList.remove('hidden');
}

function nextStage(stageId) {
    document.querySelectorAll('.container').forEach(container => container.classList.add('hidden'));
    document.getElementById(stageId).classList.remove('hidden');
}

function finishGame() {
    alert("Thank you for playing, my love! You make every moment special.");
}

// Microphone-based balloon blowing
navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const audioContext = new AudioContext();
        const microphone = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        microphone.connect(analyser);

        function detectSound() {
            analyser.getByteFrequencyData(dataArray);
            const volume = dataArray.reduce((a, b) => a + b) / bufferLength;
            
            if (volume > 50) {
                inflateBalloon();
            }

            requestAnimationFrame(detectSound);
        }

        detectSound();
    })
    .catch(error => {
        console.error('Error accessing the microphone', error);
    });

let balloonSize = 1;
function inflateBalloon() {
    balloonSize += 0.05;
    const balloon = document.getElementById('balloon');
    balloon.style.transform = `scale(${balloonSize})`;

    if (balloonSize >= 2) {
        balloon.classList.add('hidden');
        document.getElementById('message').innerText = "Your love fills my heart like this balloon!";
    }
}

// Drawing on canvas
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;

canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mousemove', draw);

function draw(event) {
    if (!drawing) return;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#ff69b4';
    ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
}

// Snakes and Ladders logic
let playerPosition = 0;
const boardSize = 100;
const ladders = { 3: 22, 5: 8, 11: 26, 20: 29 };
const snakes = { 27: 1, 21: 9, 17: 4, 19: 7 };

function rollDice() {
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    movePlayer(diceRoll);
}

function movePlayer(steps) {
    playerPosition += steps;

    if (ladders[playerPosition]) {
        playerPosition = ladders[playerPosition];
        playSound('ladder');
    } else if (snakes[playerPosition]) {
        playerPosition = snakes[playerPosition];
        playSound('snake');
    }

    updateBoard();
}

function playSound(type) {
    const audio = new Audio(type === 'snake' ? 'whoosh-sound.mp3' : 'climb-sound.mp3');
    audio.play();
}

function updateBoard() {
    const board = document.getElementById('gameBoard');
    board.innerHTML = `Player is at position: ${playerPosition}`;

    if (playerPosition >= boardSize) {
        alert('Congratulations! You have won the game.');
    }
}
