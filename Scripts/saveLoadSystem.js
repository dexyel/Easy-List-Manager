saveButton.addEventListener('click', saveList);
destroyButton.addEventListener('click', destroyList);
exportButton.addEventListener('click', exportList);
importButton.addEventListener('click', importList);
newListButton.addEventListener('click', checkBeforeReset);
window.addEventListener('load', loadListToMenu);

function saveList() {
    const listTitle = document.getElementById('list-title').innerText;
    const listItems = document.querySelectorAll(' #list-container ul li');
    const listLabels = document.querySelectorAll('#label-settings div');
    const listData = [];
    const labelData = []

    listItems.forEach((item) => {
        let textNode = null;
        let itemText = "";

        for (let i = 0; i < item.childNodes.length; i++) {
            if (item.childNodes[i].nodeType === 3) {
                textNode = item.childNodes[i];
                break;
            }
        }

        if (textNode != null) {
            itemText = textNode.textContent;
        }

        const itemBackground = item.style.background;
        const itemDate = item.querySelector('#date-modal p').textContent;
        const isDone = item.classList.contains('done');
        const isImportant = item.classList.contains('important');

        listData.push({
            text: itemText,
            background: itemBackground,
            date: itemDate,
            done: isDone,
            important: isImportant,
        });
    });

    listLabels.forEach((label) => {
        const labelText = label.querySelector('p').textContent;
        labelData.push(labelText);
    });

    let data = {
        title: listTitle,
        items: listData,
        labels: labelData,
        version: 1,
    };

    updateActiveList();
    data = checkExisting(data, listData, labelData);

    localStorage.setItem(`list-${listTitle}`, JSON.stringify(data));
} //sauvegarde la liste dans le localStorage

function checkExisting(data, listData, labelData) {
    const existingList = JSON.parse(localStorage.getItem(`list-${activeList}`));
    
    if (existingList) {
        let hasChanged = false;

        data = existingList;
        
        data.items = data.items.filter(item => {
            return listData.some(newItem => newItem.text === item.text);
        });

        listData.forEach((newItem) => {
            if (!data.items.some(item => item.text === newItem.text)) {
                data.items.push(newItem);
                hasChanged = true;
            }
        });

        data.items = data.items.map((item) => {
            const match = listData.find(newItem => newItem.text === item.text);
            if (match && match.done !== item.done) {
                hasChanged = true;
            }
            item.done = match ? match.done : false;
            return item;
        });

        labelData.forEach((newLabel) => {
            if (!data.labels.some(label => label === newLabel)) {
                data.labels = labelData;
                hasChanged = true;
            }
        });

        if (hasChanged) {
            data.version++;
        }
    }

    return data;
} //vérifie si une liste est déjà présente dans le localStorage et écrase si oui

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
} //met à jour la liste active

function addListToMenu(listTitle) {
    const li = document.createElement('li');

    li.innerHTML = `<a href="#">${listTitle}</a>`;
    activeList = `list-${listTitle}`;

    document.querySelector('#lists-menu-items').appendChild(li);
} //ajoute la liste au menu

function loadListFromMenu(activeListTitle) {
    const data = JSON.parse(localStorage.getItem(`list-${activeListTitle}`));

    if (data) {
        listTitle.textContent = activeListTitle;
        ul.innerHTML = "";

        const listItems = data.items;
        const listLabels = data.labels;

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

            loadInfoButton(item, li);
            addDeleteButton(li);

            ul.appendChild(li);
        });

        for (let i = 0; i < listLabels.length; i++) {
            document.querySelectorAll('#label-settings div p')[i].textContent = listLabels[i];
        }
        
        updateEditButtons();
        updateLabels();
        resetFilters();
    }
} //charge une liste depuis le menu

function loadListToMenu() {
    const listsMenu = document.getElementById("lists-menu-items");
    const keys = Object.keys(localStorage);

    keys.forEach((key) => {
        if (key.startsWith("list-")) {
            const li = document.createElement("li");

            li.innerHTML = `<a href="#">${key.replace('list-', '')}</a>`;
            listsMenu.appendChild(li);
        }
    });
    updateEditButtons();
} //charge le localStorange dans le menu au chargement de la page

function loadInfoButton(item, li) {
    const infoButton = document.createElement('div');
    const infoModal = document.createElement('div');
    const labelDiv = document.createElement('div');
    const labelCircle = document.createElement('i');
    const labelText = document.createElement('p');
    const dateDiv = document.createElement('div');
    const dateText = document.createElement('p');

    infoModal.id = "infos-modal";
    infoButton.id = 'info-button';
    infoButton.classList.add('fa-solid');
    infoButton.classList.add('fa-circle-info');

    labelDiv.id = "label-modal";
    labelCircle.classList.add('fa-solid');
    labelCircle.classList.add('fa-circle');
    labelCircle.style.color = item.background;
    labelText.textContent = getLabelName(item.background);

    dateDiv.id = "date-modal";

    if (item.date) {
        dateText.textContent = `${item.date}`;
    }
    else {
        dateText.textContent = "";
    }

    labelDiv.appendChild(labelCircle);
    labelDiv.appendChild(labelText);
    dateDiv.appendChild(dateText);
    infoModal.appendChild(labelDiv);
    infoModal.appendChild(dateDiv);

    infoButton.addEventListener('click', (e) => showInfos(e, li));

    li.appendChild(infoModal);
    li.appendChild(infoButton);
} //charge le bouton info et le modal

function exportList() {
    const listTitle = document.getElementById('list-title').innerText;
    const listItems = document.querySelectorAll('#list-container ul li');
    const listLabels = document.querySelectorAll('#label-settings div');
    const listData = [];
    const labelData = [];

    listItems.forEach((item) => {
        let textNode = null;
        let itemText = "";

        for (let i = 0; i < item.childNodes.length; i++) {
            if (item.childNodes[i].nodeType === 3) {
                textNode = item.childNodes[i];
                break;
            }
        }

        if (textNode != null) {
            itemText = textNode.textContent;
        }

        const itemBackground = item.style.background;
        const itemDate = item.querySelector('#date-modal p').textContent;
        const isDone = item.classList.contains('done');
        const isImportant = item.classList.contains('important');
        
        listData.push({
            text: itemText,
            background: itemBackground,
            date: itemDate,
            done: isDone,
            important: isImportant,
        });
    });

    listLabels.forEach((label) => {
        const labelText = label.querySelector('p').textContent;
        labelData.push(labelText);
    });

    const data = {
        title: listTitle,
        items: listData,
        labels: labelData,
        version: JSON.parse(localStorage.getItem(`list-${listTitle}`)).version,
    };

    const jsonData = JSON.stringify(data);
    const anchor = document.createElement('a');

    anchor.setAttribute('href', 'data:text/plain;charset=utf-8,' + jsonData);
    anchor.setAttribute('download', `${listTitle}.elmlist`);
    anchor.click();
} //exporte la liste en fichier elmlist

function importList() {
    const input = document.createElement('input');

    input.type = 'file';
    input.accept = '.elmlist';
    input.click();

    input.addEventListener('change', (e) => {
        const file = e.target.files[0];

        if (!file) {
            alert('Please select a file');
        } else if (file.name.slice(-7) !== 'elmlist') {
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
                } else if (existingList.version < importedList.version) {
                    if (confirm('An older version of the list already exists. Do you want to update it?')) {
                        replaceList(importedList, true);
                    }
                } else {
                    alert("This list already exists. Try importing a different one.")
                }
            } else {
                replaceList(importedList, false);
            }
        };
    });
} //importe un fichier elmlist et vérifie la version

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
        
        loadInfoButton(item, li);
        addDeleteButton(li);

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
    } else {
        addListToMenu(importedList.title);
    }
} //remplace la liste existante

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

    resetList();
} //détruit la liste du localStorage et du menu

function checkBeforeReset() {
    const listItems = document.querySelectorAll('#list-container li');

    if (activeList === "" && listItems.length > 0) {
        if (confirm("You haven't saved the current list. Are you sure you want to continue?")) {
            resetList();
        }
    }
    else {
        resetList();
    }
} //vérifie si la liste a été sauvegardée et alerte l'utilisateur si non

function resetList() {
    activeList = "";
    listTitle.textContent = "";
    ul.innerHTML = "";    
    
    for (let i = 0; i < labelDivs.length; i++) {
        labelDivs[i].querySelector('p').textContent = `Label ${i + 1}`;
    }

    resetInput();

    if (filterMenu.classList.contains('open')) {
        toggleFilter();
    }

    resetFilters();
    updateLabels();
} //reset la page pour démarrer une nouvelle liste