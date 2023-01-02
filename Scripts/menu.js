const newContainer = document.getElementById('new-container');
const newButton = document.getElementById('new-todo-button');

newButton.addEventListener('click', toggleMenu);

function toggleMenu() {
    const icon = newButton.firstElementChild;

    if (newContainer.classList.contains('open'))
    {
        newContainer.classList.replace('open', 'closed');
        icon.classList.replace('fa-circle-xmark', 'fa-circle-plus');
    }
    else
    {
        newContainer.classList.replace('closed', 'open');
        icon.classList.replace('fa-circle-plus', 'fa-circle-xmark');
    }
}