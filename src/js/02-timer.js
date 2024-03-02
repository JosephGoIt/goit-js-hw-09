import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Notify } from "notiflix/build/notiflix-notify-aio";

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}


const datetimePicker = flatpickr("#datetime-picker", {
  enableTime: true,
  time_24hr: true,
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const currentDate = new Date();
    if (selectedDate <= currentDate) {
      Notify.failure("Please choose a date in the future");
      return;
    }
    const startButton = document.querySelector('[data-start]');
    startButton.disabled = false;
  },
});

const startButton = document.querySelector('[data-start]');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

let countdownInterval;
let countdownTime;

startButton.addEventListener('click', () => {
  const endDate = datetimePicker.selectedDates[0];
  const currentDate = new Date();

  const difference = endDate.getTime() - currentDate.getTime();
  countdownTime = difference;

  countdownInterval = setInterval(() => {
    const remainingTime = convertMs(countdownTime);

    daysValue.textContent = addLeadingZero(remainingTime.days);
    hoursValue.textContent = addLeadingZero(remainingTime.hours);
    minutesValue.textContent = addLeadingZero(remainingTime.minutes);
    secondsValue.textContent = addLeadingZero(remainingTime.seconds);

    if (countdownTime <= 0) {
      clearInterval(countdownInterval);
      daysValue.textContent = '00';
      hoursValue.textContent = '00';
      minutesValue.textContent = '00';
      secondsValue.textContent = '00';
      startButton.disabled = true;
    } else {
      countdownTime -= 1000;
    }
  }, 1000);
});