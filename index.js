const habitForm = document.getElementById('habitForm');
const habitInput = document.getElementById('habitInput');

habitForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const habitName = habitInput.value.trim();
  if (!habitName) return;

  // Save the first habit to localStorage
  localStorage.setItem('habits', JSON.stringify([{ name: habitName, days: Array(7).fill(false) }]));

  // Redirect to habits page
  window.location.href = 'habits.html';
});
