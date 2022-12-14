const saveButton = document.getElementById('save-button');
const destroyButton = document.getElementById('destroy-button');
const exportButton = document.getElementById('export-button');
const importButton = document.getElementById('import-button');
const newListButton = document.getElementById('new-list-button');
const listTitle = document.getElementById('list-title');
const listMenu = document.getElementById('lists-menu-items');

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
    if (e.key === 'Enter') {
        e.preventDefault();
        updateActiveList();
    }
});

listMenu.addEventListener('click', (e) => {
    if (e.target.tagName === "A") {
        activeList = e.target.innerText;        
        loadListFromMenu(activeList);
    }
});

if (activeList === "") {
    destroyButton.classList.add('disabled');
}
else {
    destroyButton.classList.remove('disabled');
}

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
    
    let data = {
        title: listTitle,
        items: listData,
        version: 1,
    };

    updateActiveList();

    const existingList = JSON.parse(localStorage.getItem(`list-${listTitle}`));

    if (existingList) {
        data = existingList;
        data.version++;

        data.items = data.items.filter(item => {
            return listData.some(newItem => newItem.text === item.text);
        });

        listData.forEach(newItem => {
            if (!data.items.some(item => item.text === newItem.text)) {
                data.items.push(newItem);
            }
        });

        data.items = data.items.map((item, index) => {
            item.done = listData[index].done;
            return item;
        });
    }

    localStorage.setItem(`list-${listTitle}`, JSON.stringify(data));
}

function loadList() {
    const data = JSON.parse(localStorage.getItem(`list-${activeList}`));

    if (data) {
        const listTitle = data.title;        
        const listItems = data.items;

        document.getElementById('list-title').textContent = listTitle;

        listItems.forEach((item) => {
            const li = document.createElement('li');
            
            addListItemEvents(li);

            li.innerText = item.text;
            li.style.background = item.background;
            
            if (item.done) {
                li.classList.add("done");
            }

            if (item.important) {
                li.classList.add("important");
            }

            addDeleteButton(li);

            ul.appendChild(li);
        });

        addListToMenu(listTitle);
    }
}

function destroyList() {
    listTitle.textContent = '';
    localStorage.removeItem(`list-${activeList}`);

    const activeElements = document.querySelectorAll(`#lists-menu-items li`);

    for (const activeElement of activeElements) {
        if (activeElement.textContent.indexOf(activeList) !== -1) {
            activeElement.remove();
            break;
        }
    }

    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
    
    activeList = "";
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
        version: JSON.parse(localStorage.getItem(`list-${listTitle}`)).version,
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

        if (!file) {
            alert('Please select a file');
        } 
        else if (file.name.slice(-7) !== 'elmlist') {
            alert('The file must have a .elmlist extension');
        }

        const reader = new FileReader();

        reader.readAsText(file);
        reader.onload = (e) => {
            const importedList = JSON.parse(e.target.result);
            const existingList = JSON.parse(localStorage.getItem(`list-${importedList.title}`));

            if (existingList) {
                if (existingList.version > importedList.version) {
                    if (confirm('A newer version of the list already exists. Do you want to replace it?')) {
                        replaceList(importedList, true);
                    }
                }
                else if (existingList.version < importedList.version) {
                    if (confirm('An older version of the list already exists. Do you want to update it?')) {
                        replaceList(importedList, true);
                    }
                }
                else {
                    alert("This list already exists. Try importing a different one.")
                }
            }
            else {
                replaceList(importedList, false);
            }
        };
    });
}

function replaceList(importedList, alreadyExists) {
    document.getElementById('list-title').textContent = importedList.title;
    ul.innerHTML = '';

    importedList.items.forEach((item) => {
        const li = document.createElement('li');
        
        addListItemEvents(li);
        
        li.innerText = item.text;
        li.style.background = item.background;

        if (item.done) {
            li.classList.add('done');
        }

        if (item.important) {
            li.classList.add('important');
        }

        ul.appendChild(li);
    });

    localStorage.setItem(`list-${importedList.title}`, JSON.stringify(importedList));
    
    if (alreadyExists) {
        const activeElements = document.querySelectorAll('#lists-menu-items li');

        for (const activeElement of activeElements) {
            if (activeElement.textContent.indexOf(`list-${importedList.title}`) !== -1) {                
                activeElement.innerHTML = `<a href="#">${importedList.title}</a>`;
                break;
            }
        }
    }
    else {
        addListToMenu(importedList.title);
    }
}

function updateButtons() {
    if (listTitle.textContent.trim() === '' || ul.children.length === 0) {
        saveButton.classList.add("disabled");
        exportButton.classList.add("disabled");
        destroyButton.classList.add('disabled');
    }
    else {
        saveButton.classList.remove("disabled");
        exportButton.classList.remove("disabled");
        destroyButton.classList.remove('disabled');
    }
}

function updateActiveList() {
    if (activeList && activeList !== listTitle.innerText) {
        const activeElements = document.querySelectorAll(`#lists-menu-items li`);
        const currentListData = JSON.parse(localStorage.getItem(`list-${activeList}`));

        for (const activeElement of activeElements) {
            if (activeElement.textContent.indexOf(activeList) !== -1) {                
                activeElement.innerHTML = `<a href="#">${listTitle.innerText}</a>`;
                break;
            }
        }

        localStorage.removeItem(`list-${activeList}`);
        localStorage.setItem(`list-${listTitle.innerText}`, JSON.stringify(currentListData));

        activeList = listTitle.innerText;
    } 
    else if (!activeList && ul.children.length !== 0) {
        addListToMenu(listTitle.innerText);
    }
}

function newList() {
    activeList = "";
    listTitle.textContent = "";
    ul.innerHTML = "";
}

function loadListFromMenu(activeListTitle) {
    const data = JSON.parse(localStorage.getItem(`list-${activeListTitle}`));

    if (data) {
        listTitle.textContent = activeListTitle;
        ul.innerHTML = "";

        const listItems = data.items;

        listItems.forEach((item) => {
            const li = document.createElement("li");

            addListItemEvents(li);

            li.innerText = item.text;
            li.style.background = item.background;

            if (item.done) {
                li.classList.add("done");
            }

            if (item.important) {
                li.classList.add("important");
            }

            addDeleteButton(li);

            ul.appendChild(li);
        });

        updateButtons();
    }
}

function loadLocalStorageToMenu() {
    const listsMenu = document.getElementById("lists-menu-items");
    const keys = Object.keys(localStorage);

    keys.forEach((key) => {
        if (key.startsWith("list-")) {
            const li = document.createElement("li");

            li.innerHTML = `<a href="#">${key.replace('list-', '')}</a>`;
            listsMenu.appendChild(li);
        }        
    });

    updateButtons();
}