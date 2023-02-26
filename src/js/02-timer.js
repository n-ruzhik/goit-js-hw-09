import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const refs = {
  datePicker: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),
  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  minutes: document.querySelector('span[data-minutes]'),
  seconds: document.querySelector('span[data-seconds]'),
};

let selectDate;
refs.startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  // onClose(selectedDates) {
  //   console.log(selectedDates[0]);
  // },
  onClose(selectedDates) {
    if (selectedDates[0] <= new Date()) {
      Notiflix.Notify.failure('Please choose a date in the future');
    } else {
      refs.startBtn.disabled = false;
      selectDate = selectedDates[0];
    }
  },
};

flatpickr(refs.datePicker, options);

class Timer {
  constructor({ onTick }) {
    this.intervalId = null;
    this.isActive = false;
    this.onTick = onTick;
  }

  start() {
    if (this.isActive) {
      return;
    }

    this.isActive = true;

    this.intervalId = setInterval(() => {
      const deltaTime = selectDate - Date.now();
      const time = this.convertMs(deltaTime);

      this.onTick(time);

      if (deltaTime <= 99) {
        Notiflix.Notify.success('The countdown is over!');
        clearInterval(this.intervalId);
        this.isActive = false;
        const time = this.convertMs(deltaTime);
        this.onTick(time);
      }
    }, 1000);
  }

  // stop() {
  //   clearInterval(this.intervalId);
  //   this.isActive = false;
  //   const time = this.convertMs(0);
  //   this.onTick(time);
  // }

  addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }

  convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = this.addLeadingZero(Math.floor(ms / day));
    // Remaining hours
    const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
    // Remaining minutes
    const minutes = this.addLeadingZero(
      Math.floor(((ms % day) % hour) / minute)
    );
    // Remaining seconds
    const seconds = this.addLeadingZero(
      Math.floor((((ms % day) % hour) % minute) / second)
    );

    return { days, hours, minutes, seconds };
  }
}

const timer = new Timer({
  onTick: updateTimerface,
});

function updateTimerface({ days, hours, minutes, seconds }) {
  refs.startBtn.disabled = true;

  refs.days.textContent = `${days}`;
  refs.hours.textContent = `${hours}`;
  refs.minutes.textContent = `${minutes}`;
  refs.seconds.textContent = `${seconds}`;
}

refs.startBtn.addEventListener('click', timer.start.bind(timer));
