const enterButton = document.getElementById('enter-button');
const ul = document.querySelector('#list-container ul');
const importantButton = document.getElementById('important-button');

let item = document.getElementsByTagName('li');
let activeList = "";

enterButton.addEventListener('click', addItemOnClick);
input.addEventListener('keypress', addItemOnEnter);

importantButton.addEventListener('click', () => {
    importantButton.classList.toggle('active');
});

function createListItem() {
    let li = document.createElement('li');    
    let deleteButton = document.createElement('button');
    let gradientString = input.style.background;

    addListItemEvents(li);

    deleteButton.classList.add("delete-button");

    if (gradientString)
    {
        let colorRegex = /^linear-gradient\(to right, (.*?) /;
        let color = gradientString.match(colorRegex)[1];    
        
        li.style.background = color;
    }
    else
    {
        li.style.background = 'rgba(255, 255, 255, 0.3)';
    }

    if (importantButton.classList.contains('active')) {
        li.classList.toggle('important');
        importantButton.classList.toggle('active');
    }

    li.appendChild(document.createTextNode(input.value));
    li.appendChild(deleteButton);
    
    ul.appendChild(li);

    input.value = "";    
}

function addItemOnClick() {
    if (input.value.length > 0)
    {
        createListItem();
    }
}

function addItemOnEnter(event) {
    if (input.value.length > 0 && event.keyCode === 13)
    {
        createListItem();
    }
}

function addListItemEvents(li) {
    li.addEventListener('click', () => {
        li.classList.toggle('done');
    });

    li.addEventListener('mouseover', () => {
        let computedStyle = window.getComputedStyle(li);
        let color = computedStyle.getPropertyValue('background-color');
        let match = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        let rgba = match ? `rgba(${match[1]}, ${match[2]}, ${match[3]}, 0.3)` : color;

        li.style.boxShadow = `0 0 200px ${rgba}`;
    });

    li.addEventListener('mouseout', () => { 
        li.style.boxShadow = "none";
    });
}

function addListToMenu(listTitle) {
    const li = document.createElement('li');
    
    li.innerHTML = `<a href="#">${listTitle}</a>`;
    activeList = `list-${listTitle}`;

    document.querySelector('#lists-menu-items').appendChild(li);
}

