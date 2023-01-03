const newContainer = document.getElementById('new-container');
const newButton = document.getElementById('new-todo-button');
const input = document.getElementById('todo-input');
const button1 = document.querySelector('#color1-button');
const button2 = document.querySelector('#color2-button');
const button3 = document.querySelector('#color3-button');
const button4 = document.querySelector('#color4-button');
const button5 = document.querySelector('#color5-button');
const circles = document.querySelectorAll('#color-buttons i');

newButton.addEventListener('click', toggleMenu);

button1.addEventListener('click', () => {
    input.style.background = `linear-gradient(to right, ${colors[0]} 7%, white 0%)`;
});

button2.addEventListener('click', () => {
    input.style.background = `linear-gradient(to right, ${colors[1]} 7%, white 0%)`;
});

button3.addEventListener('click', () => {
    input.style.background = `linear-gradient(to right, ${colors[2]} 7%, white 0%)`;
});

button4.addEventListener('click', () => {
    input.style.background = `linear-gradient(to right, ${colors[3]} 7%, white 0%)`;
});

button5.addEventListener('click', () => {
    input.style.background = `linear-gradient(to right, ${colors[4]} 7%, white 0%)`;
});

function toggleMenu() {
    const icon = newButton.firstElementChild;

    if (newContainer.classList.contains('open'))
    {
        newContainer.classList.replace('open', 'closed');
        icon.classList.replace('fa-circle-xmark', 'fa-circle-plus');
        
        setTimeout(() => {
            input.style.background = "white";
        }, 200);
        
    }
    else
    {
        newContainer.classList.replace('closed', 'open');
        icon.classList.replace('fa-circle-plus', 'fa-circle-xmark');
    }
}

for (var i = 0; i < circles.length; i++)
{
    circles[i].style.color = colors[i];
}