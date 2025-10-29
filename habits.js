// Array of days of the week
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Load saved habits from localStorage, or initialize an empty array if none exist
let habits = JSON.parse(localStorage.getItem('habits')) || [];

// Function to save habits to localStorage
function saveHabits() {
  localStorage.setItem('habits', JSON.stringify(habits));
}

// Function to generate an array representing all days in the current month
// Each element is false initially, meaning the habit has not been completed
function getDaysInCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const numDays = new Date(year, month + 1, 0).getDate(); // Get number of days in month
  return Array.from({ length: numDays }, () => false); // Initialize all days as false
}

// Function to render all habits and their calendars on the page
function renderHabits() {
  const list = document.getElementById('habitList');
  list.innerHTML = ''; // Clear previous content

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const currentMonthName = now.toLocaleString('default', { month: 'long' });

  habits.forEach((habit, habitIndex) => {
    const habitDiv = document.createElement('div');
    habitDiv.className = 'habit';

    // Create habit title showing name and current month/year
    const title = document.createElement('h3');
    title.textContent = `${habit.name} — ${currentMonthName} ${currentYear}`;
    habitDiv.appendChild(title);

    // Create calendar container
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

    // Calculate first day of the month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const numDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const totalCells = Math.ceil((firstDay + numDays) / 7) * 7; // Ensure full weeks

    let dayIndex = 0;
    for (let i = 0; i < totalCells; i++) {
      if (i % 7 === 0) {
        var row = document.createElement('div');
        row.className = 'calendar-row';
        calendar.appendChild(row);
      }

      const cell = document.createElement('div');
      cell.className = 'calendar-cell';

      // Fill in actual days of the month
      if (i >= firstDay && dayIndex < numDays) {
        const currentDayIndex = dayIndex;  // capture dayIndex for closure

        const checked = habit.days[currentDayIndex]; // Check if this day is marked
        cell.classList.add('day');
        if (checked) cell.classList.add('checked'); // Add checked class if completed

        cell.textContent = currentDayIndex + 1; // Display day number

        // Toggle habit completion when clicked
        cell.onclick = () => {
          habit.days[currentDayIndex] = !habit.days[currentDayIndex];
          saveHabits(); // Save updated habit
          renderHabits(); // Re-render calendar
        };

        dayIndex++;
      } else {
        cell.classList.add('empty'); // Empty cells before/after the month
      }

      row.appendChild(cell);
    }

    habitDiv.appendChild(calendar);
    list.appendChild(habitDiv); // Add habit div to main list
  });
}

// Initial render on page load
renderHabits();

// --- Add Habit Popup Logic ---
const showAddHabitBtn = document.getElementById('showAddHabitBtn');
const addHabitPopup = document.getElementById('addHabitPopup');
const newHabitInput = document.getElementById('newHabitInput');
const addHabitBtn = document.getElementById('addHabitBtn');
const cancelAddBtn = document.getElementById('cancelAddBtn');

// Show popup when "Add Habit" button is clicked
showAddHabitBtn.addEventListener('click', () => {
  addHabitPopup.classList.remove('hidden');
  newHabitInput.focus(); // Focus input field
  showAddHabitBtn.disabled = true; // Prevent multiple popups
});

// Hide popup when cancel is clicked
cancelAddBtn.addEventListener('click', () => {
  addHabitPopup.classList.add('hidden');
  newHabitInput.value = '';
  showAddHabitBtn.disabled = false;
});

// Add new habit when "Add" button is clicked
addHabitBtn.addEventListener('click', () => {
  const name = newHabitInput.value.trim();
  if (!name) return; // Do nothing if input is empty

  const newHabit = {
    name: name,
    days: getDaysInCurrentMonth() // Initialize days for the current month
  };

  habits.push(newHabit); // Add habit to array
  saveHabits(); // Save to localStorage
  renderHabits(); // Re-render calendar

  newHabitInput.value = '';
  addHabitPopup.classList.add('hidden');
  showAddHabitBtn.disabled = false;
});

// Allow Enter key to add habit
newHabitInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addHabitBtn.click();
  }
});

// --- Reset All Habits ---
const resetBtn = document.getElementById('resetBtn');

resetBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to reset all habits? This will delete all data.')) {
    habits = []; // Clear habit array
    saveHabits(); // Clear localStorage
    renderHabits(); // Re-render empty state
  }
});
