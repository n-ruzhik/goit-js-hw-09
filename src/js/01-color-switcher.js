const body = document.querySelector('body');
const startBtn = document.querySelector('[data-start]');
const stopBtn = document.querySelector('[data-stop]');

let timer = null;

stopBtn.disabled = true;

startBtn.addEventListener('click', onClickStartBtn);
stopBtn.addEventListener('click', onClickStopBtn);

function onClickStartBtn() {
  startBtn.disabled = true;
  stopBtn.disabled = false;

  timer = setInterval(() => {
    body.style.backgroundColor = getRandomHexColor();
  }, 1000);
}

function onClickStopBtn() {
  stopBtn.disabled = true;
  startBtn.disabled = false;
  clearInterval(timer);
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}
