
//creates a constant which correlates to the HTML element of the name in ""
const habitForm = document.getElementById('habitForm');
const habitInput = document.getElementById('habitInput');

function getDaysInCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based
  const numDays = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: numDays }, () => false);
}

habitForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const habitName = habitInput.value.trim();
  if (!habitName) return;

  // Use full month instead of just 7 days
  const habit = {
    name: habitName,
    days: getDaysInCurrentMonth()
  };

  localStorage.setItem('habits', JSON.stringify([habit]));

  // Redirect to habits page
  window.location.href = 'habits.html';
});
