

const saveButton = document.getElementById('save-button');
const destroyButton = document.getElementById('destroy-button');
const exportButton = document.getElementById('export-button');
const importButton = document.getElementById('import-button');
const newListButton = document.getElementById('new-list-button');
const listTitle = document.getElementById('list-title');

saveButton.addEventListener('click', saveList);
destroyButton.addEventListener('click', destroyList);
exportButton.addEventListener('click', exportList);
importButton.addEventListener('click', importList);
newListButton.addEventListener('click', newList);

window.addEventListener('load', loadLocalStorageToMenu);
ul.addEventListener('DOMSubtreeModified', updateButtons);
ul.addEventListener('DOMNodeRemoved', updateButtons);

listTitle.addEventListener('input', () => {
    updateButtons();
});

listTitle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')
    {
        e.preventDefault();
        updateActiveList();
    }
});

document.getElementById('lists-menu-items').addEventListener('click', (e) => {

    console.log(e.target.innerText + " " + e.target.textContent + " " + e.target.tagName);

    if (e.target.tagName === "A")
    {
        activeList = e.target.innerText;
        
        loadListFromMenu(activeList);
    }
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

    updateActiveList();
    
    localStorage.setItem(listTitle, JSON.stringify(data));
}

function loadList() {
    const data = JSON.parse(localStorage.getItem(activeList));

    if (data)
    {
        const listTitle = data.title;
        document.getElementById('list-title').textContent = listTitle;

        const listItems = data.items;
        listItems.forEach((item) => {
            const li = document.createElement('li');
            
            addListItemEvents(li);

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

        addListToMenu(listTitle);
    }

    updateButtons();
}

function destroyList() {
    listTitle.textContent = '';
    localStorage.removeItem('list');

    while (ul.firstChild)
    {
        ul.removeChild(ul.firstChild);
    }    
}

function exportList() {
    const listTitle = document.getElementById('list-title').innerText;
    const listItems = document.querySelectorAll('#list-container ul li');
    let listData = [];

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

    const jsonData = JSON.stringify(data);
    const anchor = document.createElement('a');

    anchor.setAttribute('href', 'data:text/plain;charset=utf-8,' + jsonData);
    anchor.setAttribute('download', `${listTitle}.elmlist`);    
    anchor.click();
}

function importList() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.elmlist';
    input.click();

    input.addEventListener('change', (e) => {
        const file = e.target.files[0];

        if (!file) 
        {
            alert('Please select a file');
        } 
        else if (file.name.slice(-7) !== 'elmlist') 
        {
            alert('The file must have a .elmlist extension');
        }

        const reader = new FileReader();

        reader.readAsText(file);
        reader.onload = (e) => {
            const listData = JSON.parse(e.target.result);
            
            document.getElementById('list-title').textContent = listData.title;
            ul.innerHTML = '';

            listData.items.forEach((item) => {
                const li = document.createElement('li');
                
                addListItemEvents(li);
                
                li.innerText = item.text;
                li.style.background = item.background;

                if (item.done)
                {
                    li.classList.add('done');
                }

                if (item.important)
                {
                    li.classList.add('important');
                }

                ul.appendChild(li);
            });

            localStorage.setItem(listData.title, JSON.stringify(listData));
            addListToMenu(listData.title);
        };
    });
}

function updateButtons() {
    if (listTitle.textContent.trim() === '' || ul.children.length === 0)
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

function updateActiveList() {
    if (activeList && activeList !== listTitle.innerText) 
    {
        const activeElements = document.querySelectorAll(`#lists-menu-items li`);
        const currentListData = JSON.parse(localStorage.getItem(activeList));

        for (const activeElement of activeElements) 
        {
            if (activeElement.textContent.indexOf(activeList) !== -1) 
            {                
                activeElement.innerHTML = `<a href="#">${listTitle.innerText}</a>`;
                break;
            }
        }

        localStorage.removeItem(activeList);
        localStorage.setItem(listTitle.innerText, JSON.stringify(currentListData));
        console.log("activeList: " + activeList + " listTitle: " + listTitle.innerText);
        activeList = listTitle.innerText;
        console.log("activeList: " + activeList + " listTitle: " + listTitle.innerText);
    } 
    else if (!activeList && ul.children.length !== 0) 
    {
        addListToMenu(listTitle.innerText);
    }
}

function newList() {
    activeList = "";
    listTitle.textContent = "";
    ul.innerHTML = "";
}

function loadListFromMenu(activeListTitle) {
    console.log(activeListTitle);

    const data = JSON.parse(localStorage.getItem(activeListTitle));

    if (data)
    {
        listTitle.textContent = activeListTitle;
        ul.innerHTML = "";

        const listItems = data.items;

        listItems.forEach((item) => {
            const li = document.createElement("li");

            addListItemEvents(li);

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

        updateButtons();
    }
}

function loadLocalStorageToMenu() {
    const listsMenu = document.getElementById("lists-menu-items");
    const keys = Object.keys(localStorage);

    keys.forEach((key) => {
        const li = document.createElement("li");

        li.innerHTML = `<a href="#">${key}</a>`;

        listsMenu.appendChild(li);
    });
}