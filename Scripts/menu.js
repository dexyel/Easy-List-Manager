const newContainer = document.getElementById('new-container');
const newButton = document.getElementById('new-todo-button');
const editContainer = document.getElementById('edit-container');
const input = document.getElementById('todo-input');
const circles = document.querySelectorAll('#color-buttons button');

let activeButton;

newButton.addEventListener('click', toggleMenu);

// for (var i = 0; i < circles.length; i++) 
// {
//     console.log(circles[i]);
//     circles[i].addEventListener('click', (e) => {
//         input.style.background = `linear-gradient(to right, ${colors[i]} 7%, white 0%)`;
//         activateButton(e.target);
//     });
// }

for (var i = 0; i < circles.length; i++) 
{
    circles[i].addEventListener('click', (function(index) {        
        return function() {
            input.style.background = `linear-gradient(to right, ${colors[index]} 7%, white 0%)`;
            activateButton(circles[index].firstElementChild);
        };
    })(i));
}

function toggleMenu() {
    const icon = newButton.firstElementChild;

    if (newContainer.classList.contains('open'))
    {
        newContainer.classList.replace('open', 'closed');
        editContainer.classList.replace('visible', 'hidden');
        icon.style.transform = 'rotateZ(0)';
        
        setTimeout(() => {
            input.style.background = "white";
        }, 200);
        
    }
    else
    {
        newContainer.classList.replace('closed', 'open');
        editContainer.classList.replace('hidden', 'visible');
        icon.style.transform = 'rotateZ(45deg)';
    }
}

for (var i = 0; i < circles.length; i++)
{
    circles[i].style.color = colors[i];
}

function activateButton(button) {
    if (button === activeButton) 
    {
        activeButton = null;
        button.classList.remove('is-active');
        input.style.background = "white";
    } 
    else 
    {
        if (activeButton) 
        {
          activeButton.classList.remove('is-active');
        }

        activeButton = button;
        button.classList.add('is-active');
    }  
}