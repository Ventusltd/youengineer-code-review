const monthTitle = document.getElementById("monthTitle");
const calendarDays = document.getElementById("calendarDays");
const digitalTime = document.getElementById("digitalTime");
const digitalDate = document.getElementById("digitalDate");
const mythNote = document.getElementById("mythNote");
const hourHand = document.getElementById("hourHand");
const minuteHand = document.getElementById("minuteHand");
const secondHand = document.getElementById("secondHand");

const previousMonthButton = document.getElementById("previousMonth");
const nextMonthButton = document.getElementById("nextMonth");
const todayButton = document.getElementById("todayButton");

const shownDate = new Date();

const mythNotes = [
  "Athena rewards patience before power.",
  "Chronos counts the seconds, but wisdom chooses how to spend them.",
  "Medusa says: do not freeze, debug calmly.",
  "Every temple is built one stone at a time.",
  "A clear commit message is a modern inscription in marble."
];

function updateClock() {
  const now = new Date();

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  digitalTime.textContent = now.toLocaleTimeString("en-GB");
  digitalDate.textContent = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const secondDegrees = seconds * 6;
  const minuteDegrees = minutes * 6 + seconds * 0.1;
  const hourDegrees = (hours % 12) * 30 + minutes * 0.5;

  secondHand.style.transform = `rotate(${secondDegrees}deg)`;
  minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
  hourHand.style.transform = `rotate(${hourDegrees}deg)`;

  const noteIndex = Math.floor(seconds / 12) % mythNotes.length;
  mythNote.textContent = mythNotes[noteIndex];
}

function renderCalendar() {
  calendarDays.innerHTML = "";

  const year = shownDate.getFullYear();
  const month = shownDate.getMonth();

  monthTitle.textContent = shownDate.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric"
  });

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const today = new Date();

  // JavaScript starts the week on Sunday. This project uses a Monday-first calendar.
  const emptyDaysBeforeMonth = (firstDayOfMonth.getDay() + 6) % 7;

  for (let i = 0; i < emptyDaysBeforeMonth; i++) {
    const emptySquare = document.createElement("div");
    emptySquare.className = "day empty";
    calendarDays.appendChild(emptySquare);
  }

  for (let dayNumber = 1; dayNumber <= lastDayOfMonth.getDate(); dayNumber++) {
    const daySquare = document.createElement("div");
    daySquare.className = "day";
    daySquare.textContent = dayNumber;

    const isToday =
      dayNumber === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    if (isToday) {
      daySquare.classList.add("today");
      daySquare.setAttribute("aria-label", `${dayNumber}, today`);
    } else {
      daySquare.setAttribute("aria-label", `${dayNumber}`);
    }

    calendarDays.appendChild(daySquare);
  }
}

previousMonthButton.addEventListener("click", () => {
  shownDate.setMonth(shownDate.getMonth() - 1);
  renderCalendar();
});

nextMonthButton.addEventListener("click", () => {
  shownDate.setMonth(shownDate.getMonth() + 1);
  renderCalendar();
});

todayButton.addEventListener("click", () => {
  const today = new Date();
  shownDate.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
  renderCalendar();
});

renderCalendar();
updateClock();
setInterval(updateClock, 1000);
