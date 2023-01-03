const enterButton = document.getElementById('enter-button');
const ul = document.querySelector('ul');
const importantButton = document.getElementById('important-button');

let item = document.getElementsByTagName('li');

enterButton.addEventListener('click', addItemOnClick);
input.addEventListener('keypress', addItemOnEnter);
importantButton.addEventListener('click', () => {
    importantButton.classList.toggle('active');
});

function createListItem() {
    let li = document.createElement('li');
    
    let gradientString = input.style.background;

    if (gradientString)
    {
        let colorRegex = /^linear-gradient\(to right, (.*?) /;
        let color = gradientString.match(colorRegex)[1];    
        
        li.style.background = color;
    }
    else
    {
        li.style.background = 'rgba(inherit, 0.3)';
    }

    if (importantButton.classList.contains('active')) {
        li.classList.toggle('important');
        importantButton.classList.toggle('active');
    }

    li.appendChild(document.createTextNode(input.value));
    
    ul.appendChild(li);

    input.value = "";    

    li.addEventListener('click', () => {
        li.classList.toggle('done');
    });
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