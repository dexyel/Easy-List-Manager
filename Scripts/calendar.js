const calendarButton = document.getElementById('calendar-button');

calendarButton.addEventListener('click', openCalendar);

function openCalendar() {
    const calendarModal = document.getElementById('calendar-app');

    if (calendarModal.classList.contains('modal')) {
        calendarModal.classList.toggle('modal');
        calendarButton.classList.toggle('calendar-active');
    }
    else
    {
        calendarModal.classList.toggle('modal');
        calendarButton.classList.toggle('calendar-active');
    }
}