const saveButton = document.getElementById('save-button');
const destroyButton = document.getElementById('destroy-button');
const exportButton = document.getElementById('export-button');
const listTitle = document.getElementById('list-title');

saveButton.addEventListener('click', saveList);
destroyButton.addEventListener('click', destroyList);
exportButton.addEventListener('click', exportList);

window.addEventListener('load', updateButtons);
ul.addEventListener('DOMSubtreeModified', updateButtons);
ul.addEventListener('DOMNodeRemoved', updateButtons);

listTitle.addEventListener('input', () => {
    updateButtons();
});

function saveList() {
    const listTitle = document.getElementById('list-title').innerText;
    const listItems = document.querySelectorAll(' #list-container ul li');
    const listData = [];

    listItems.forEach((item) => {
        const itemText = item.innerText;
        const itemBackground = item.style.background;
        const isDone = item.classList.contains('done');
        const isImportant = item.classList.contains('important');

        listData.push({
            text: itemText,
            background: itemBackground,
            done: isDone,
            important: isImportant,
        });
    });
    
    const data = {
        title: listTitle,
        items: listData,
    };
    
    localStorage.setItem('list', JSON.stringify(data));
}

function loadList() {
    const data = JSON.parse(localStorage.getItem('list'));

    if (data)
    {
        const listTitle = data.title;
        document.getElementById('list-title').textContent = listTitle;

        const listItems = data.items;
        listItems.forEach((item) => {
            const li = document.createElement('li');

            li.innerText = item.text;
            li.style.background = item.background;
            
            if (item.done)
            {
                li.classList.add("done");
            }

            if (item.important)
            {
                li.classList.add("important");
            }

            ul.appendChild(li);
        });
    }
}

function destroyList() {
    listTitle.textContent = '';
    
    while (ul.firstChild)
    {
        ul.removeChild(ul.firstChild);
    }    
}

function updateButtons() {
    if (listTitle.textContent.trim() === '' && ul.children.length === 0)
    {
        saveButton.classList.add("disabled");
        exportButton.classList.add("disabled");
    }
    else
    {
        saveButton.classList.remove("disabled");
        exportButton.classList.remove("disabled");
    }
}

function exportList() {
    console.log('exportList function called');
    const listTitle = document.getElementById('list-title').innerText;
    const listItems = document.querySelectorAll(' #list-container ul li');
    const listData = [];

    listItems.forEach((item) => {
        const itemText = item.innerText;
        const itemBackground = item.style.background;
        const isDone = item.classList.contains('done');
        const isImportant = item.classList.contains('important');

        listData.push({
            text: itemText,
            background: itemBackground,
            done: isDone,
            important: isImportant,
        });
    });
    
    const data = {
        title: listTitle,
        items: listData,
    };

    console.log('data object:', data);
    const fileContent = JSON.stringify(data);

    downloadList(`list.elmlist`, fileContent);
}

function downloadList(filename, text) {
    console.log('downloadList function called');
    console.log('filename:', filename);
    console.log('text:', text);
    let element = document.createElement('a');

    element.setAttribute('href', 'data:text/plain;charset=utf-8' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}