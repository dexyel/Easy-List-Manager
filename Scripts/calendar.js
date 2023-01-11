const calendarButton = document.getElementById('calendar-button');
const calendarApp = document.getElementById('calendar-app');
const calendarGrid = document.getElementById('calendar-days-numbers');

const nextMonthButton = document.getElementById('next-month-button');
const previousMonthButton = document.getElementById('previous-month-button');
const nextYearButton = document.getElementById('next-year-button');
const previousYearButton = document.getElementById('previous-year-button');
const resetDateButton = document.getElementById('reset-date-button');

const monthText = document.getElementById('month-text');
const yearText = document.getElementById('year-text');

const pickedDate = document.getElementById('calendar-picked-date');
const pickedDateText = document.getElementById('date-text');
const deletePickedDate = document.getElementById('delete-date-button');

const currentDate = new Date();
const monthsList = ["JAN.", "FEV.", "MAR.", "AVR.", "MAI", "JUIN", "JUI.", "AOUT", "SEP.", "OCT.", "NOV.", "DEC."];

let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

calendarButton.addEventListener('click', openCalendar);
nextMonthButton.addEventListener('click', nextMonth);
previousMonthButton.addEventListener('click', previousMonth);
nextYearButton.addEventListener('click', nextYear);
previousYearButton.addEventListener('click', previousYear);
resetDateButton.addEventListener('click', resetDate);
deletePickedDate.addEventListener('click', resetPickedDate);

function openCalendar() {
    const calendarModal = document.getElementById('calendar-app');

    if (calendarModal.classList.contains('modal')) {
        calendarModal.classList.toggle('modal');
        calendarButton.classList.toggle('calendar-active');
    }
    else {
        calendarModal.classList.toggle('modal');
        calendarButton.classList.toggle('calendar-active');
    }

    generateCalendar();
}

function generateCalendar() {
    calendarGrid.innerHTML = "";

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const firstDayWeek = (firstDay.getDay() + 6) % 7;
    const lastDayWeek = lastDay.getDay();

    for (var i = 0; i < firstDayWeek; i++) {
        const day = document.createElement('button');        
        day.setAttribute('disabled', 'true');
        calendarGrid.appendChild(day);
    }

    for (var i = 1; i <= lastDay.getDate(); i++) {
        const day = document.createElement('button');
        day.addEventListener('click', (e) => pickDate(e));
        day.innerText = i;
        calendarGrid.appendChild(day);
    }

    for (var i = 0; i < (6 - lastDayWeek); i++) {
        const day = document.createElement('button');
        day.setAttribute('disabled', 'true');
        calendarGrid.appendChild(day);
    }

    monthText.innerText = monthsList[currentMonth];
    yearText.innerText = currentYear;
}

function nextMonth() {
    currentMonth++;

    if (currentMonth >= 11){
        currentYear++;
        currentMonth = 0;
    }

    generateCalendar();
}

function previousMonth() {
    currentMonth--;

    if (currentMonth < 0){
        currentYear--;
        currentMonth = 11;
    }

    generateCalendar();
}

function nextYear() {
    currentYear ++;
    generateCalendar();
}

function previousYear() {
    currentYear--;
    generateCalendar();
}

function resetDate() {
    currentMonth = currentDate.getMonth();
    currentYear = currentDate.getFullYear();
    generateCalendar();
}

function pickDate(e) {
    pickedDateText.innerText = `${e.target.innerText.padStart(2, '0')}/${(currentMonth + 1).toString().padStart(2, '0')}/${currentYear.toString().slice(-2)}`;
    pickedDate.classList.add('selected');
}

function resetPickedDate() {
    pickedDateText.innerText = "";
    pickedDate.classList.remove('selected');
}