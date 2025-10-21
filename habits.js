const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
let habits = JSON.parse(localStorage.getItem('habits')) || [];

function saveHabits() {
  localStorage.setItem('habits', JSON.stringify(habits));
}

function getDaysInCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const numDays = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: numDays }, () => false);
}

function renderHabits() {
  const list = document.getElementById('habitList');
  list.innerHTML = '';

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const currentMonthName = now.toLocaleString('default', { month: 'long' });

  habits.forEach((habit, habitIndex) => {
    const habitDiv = document.createElement('div');
    habitDiv.className = 'habit';

    const title = document.createElement('h3');
    title.textContent = `${habit.name} — ${currentMonthName} ${currentYear}`;
    habitDiv.appendChild(title);

    const calendar = document.createElement('div');
    calendar.className = 'calendar';

    // Weekday headers
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const headerRow = document.createElement('div');
    headerRow.className = 'calendar-row header';
    weekdays.forEach(day => {
      const cell = document.createElement('div');
      cell.className = 'calendar-cell header-cell';
      cell.textContent = day;
      headerRow.appendChild(cell);
    });
    calendar.appendChild(headerRow);

    // Generate calendar days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const numDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const totalCells = Math.ceil((firstDay + numDays) / 7) * 7;

    let dayIndex = 0;
    for (let i = 0; i < totalCells; i++) {
      if (i % 7 === 0) {
        var row = document.createElement('div');
        row.className = 'calendar-row';
        calendar.appendChild(row);
      }

      const cell = document.createElement('div');
      cell.className = 'calendar-cell';

      if (i >= firstDay && dayIndex < numDays) {
        const currentDayIndex = dayIndex;  // capture dayIndex for closure

        const checked = habit.days[currentDayIndex];
        cell.classList.add('day');
        if (checked) cell.classList.add('checked');

        cell.textContent = currentDayIndex + 1;
        cell.onclick = () => {
          habit.days[currentDayIndex] = !habit.days[currentDayIndex];
          saveHabits();
          renderHabits();
        };

        dayIndex++;
      } else {
        cell.classList.add('empty');
      }

      row.appendChild(cell);
    }

    habitDiv.appendChild(calendar);
    list.appendChild(habitDiv);
  });
}


// Run on load
renderHabits();

// --- Add Habit Logic ---
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

// --- Reset Button Logic ---
const resetBtn = document.getElementById('resetBtn');

resetBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to reset all habits? This will delete all data.')) {
    habits = [];
    saveHabits();
    renderHabits();
  }
});
