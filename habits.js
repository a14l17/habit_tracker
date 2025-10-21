const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
let habits = JSON.parse(localStorage.getItem('habits')) || [];

function saveHabits() {
  localStorage.setItem('habits', JSON.stringify(habits));
}

function getDaysInCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();        // 0‑based
  const numDays = new Date(year, month+1, 0).getDate();  // last day of month → number of days in month  :contentReference[oaicite:0]{index=0}
  return Array.from({ length: numDays }, () => false);
}

function renderHabits() {
  const list = document.getElementById('habitList');
  list.innerHTML = '';

  const now = new Date();
  const currentMonthName = now.toLocaleString('default', { month: 'long' });
  const currentYear = now.getFullYear();

  habits.forEach((habit, habitIndex) => {
    const habitDiv = document.createElement('div');
    habitDiv.className = 'habit';

    const title = document.createElement('h3');
    title.textContent = `${habit.name} — ${currentMonthName} ${currentYear}`;
    habitDiv.appendChild(title);

    const daysDiv = document.createElement('div');
    daysDiv.className = 'days';

    habit.days.forEach((checked, dayIndex) => {
      const dayDiv = document.createElement('div');
      dayDiv.className = 'day' + (checked ? ' checked' : '');
      dayDiv.textContent = (dayIndex + 1);  // show day number 1‑numDays
      dayDiv.onclick = () => {
        habit.days[dayIndex] = !habit.days[dayIndex];
        saveHabits();
        renderHabits();
      };
      daysDiv.appendChild(dayDiv);
    });

    habitDiv.appendChild(daysDiv);
    list.appendChild(habitDiv);
  });
}

renderHabits();

// Reset all habits button (existing logic)
// …
const showAddHabitBtn = document.getElementById('showAddHabitBtn');
const addHabitPopup = document.getElementById('addHabitPopup');
const newHabitInput = document.getElementById('newHabitInput');
const addHabitBtn = document.getElementById('addHabitBtn');
const cancelAddBtn = document.getElementById('cancelAddBtn');

showAddHabitBtn.addEventListener('click', () => {
  addHabitPopup.classList.remove('hidden');
  newHabitInput.focus();
  showAddHabitBtn.disabled = true;
});

cancelAddBtn.addEventListener('click', () => {
  addHabitPopup.classList.add('hidden');
  newHabitInput.value = '';
  showAddHabitBtn.disabled = false;
});

addHabitBtn.addEventListener('click', () => {
  const name = newHabitInput.value.trim();
  if (!name) return;

  const newHabit = {
    name: name,
    days: getDaysInCurrentMonth()
  };
  
  habits.push(newHabit);
  saveHabits();
  renderHabits();

  newHabitInput.value = '';
  addHabitPopup.classList.add('hidden');
  showAddHabitBtn.disabled = false;
});

newHabitInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addHabitBtn.click();
  }
});
