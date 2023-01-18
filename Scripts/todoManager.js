//#region Variables
const colors = [
    "rgb(var(--color1))",
    "rgb(var(--color2))",
    "rgb(var(--color3))",
    "rgb(var(--color4))",
    "rgb(var(--color5))"
];

/* HEADER */
const backgroundTitle = document.getElementById('title-background'); //titre (mode background)
const initials = document.querySelectorAll('.initials'); //initiales des titres
const headerContainer = document.getElementById('header-container'); //container header
const settingsButton = document.getElementById('settings-button'); //bouton paramètres
const settingsContainer = document.getElementById('settings-container'); //container paramètres
const labelDivs = document.querySelectorAll("#label-settings div"); //container labels

/* MAIN */
const listContainer = document.getElementById('list-container'); //container liste
const ul = document.querySelector('#list-container ul'); //ul principal de la liste
const listTitle = document.getElementById('list-title'); //titre liste
const editContainer = document.getElementById('edit-container'); //container de l'interface
const saveButton = document.getElementById('save-button');
const destroyButton = document.getElementById('destroy-button');
const exportButton = document.getElementById('export-button');
const importButton = document.getElementById('import-button');
const listMenu = document.getElementById('lists-menu-items');
const newListButton = document.getElementById('new-list-button');

/* INPUT */
const inputContainer = document.getElementById('new-container'); //container de l'input
const newButton = document.getElementById('new-todo-button'); //bouton +
const circles = document.querySelectorAll('#color-buttons button'); //boutons de selection des couleurs
const input = document.getElementById('todo-input'); //input
const enterButton = document.getElementById('enter-button'); //bouton de validation input
const importantButton = document.getElementById('important-button'); //bouton important
const calendarButton = document.getElementById('calendar-button');

let activeList = "";
let activeButton;
//#endregion 

//#region EventListeners
enterButton.addEventListener('click', addItemOnClick);
input.addEventListener('keypress', addItemOnEnter);
newButton.addEventListener('click', toggleInterface);
settingsButton.addEventListener('click', openSettings);
saveButton.addEventListener('click', saveList);
destroyButton.addEventListener('click', destroyList);
exportButton.addEventListener('click', exportList);
importButton.addEventListener('click', importList);
newListButton.addEventListener('click', resetList);
window.addEventListener('load', loadLocalStorageToMenu);
ul.addEventListener('DOMSubtreeModified', updateEditButtons);
ul.addEventListener('DOMNodeRemoved', updateEditButtons);
listTitle.addEventListener('input', () => updateEditButtons);

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

importantButton.addEventListener('click', () => {
    importantButton.classList.toggle('active');
});

for (let i = 0; i < circles.length; i++) {
    circles[i].addEventListener('click', (function (index) {
        return function () {
            input.style.background = `linear-gradient(to right, ${colors[index]} 7%, white 0%)`;
            activateColorButton(circles[index].firstElementChild);
        };
    })(i));
}
//#endregion

//#region Interface
for (let i = 0; i < labelDivs.length; i++) {
    const label = labelDivs[i];
    const circle = label.firstElementChild;

    circle.style.color = colors[i]; 
    
    label.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();            
            updateLabels();
        }
    }); 
} //attribue les couleurs aux labels

for (let i = 0; i < circles.length; i++) {
    circles[i].style.color = colors[i];
} //attribue les couleurs des labels aux boutons de couleurs de l'input

initials.forEach(initial => {
    let randomIndex = Math.floor(Math.random() * colors.length);
    initial.style.color = colors[randomIndex]; 
}); //attribue une couleur aléatoire aux initiales des titres

activeList === "" ? destroyButton.classList.add('disabled') : destroyButton.classList.remove('disabled'); //active le bouton détruire si une liste est active, sinon le désactive

function openSettings() { 
    if (settingsContainer.classList.contains('open')) {
        settingsContainer.classList.replace('open', 'closed');
    } else {
        settingsContainer.classList.replace('closed', 'open');
    }
} //ouvre les paramètres

function getLabelName(color) { 
    let labelName = "";

   labelDivs.forEach((label) => {
        const circle = label.firstElementChild;

        if(circle.style.color === color) {
            labelName = label.querySelector("p").innerText;
        }        
    });

    return labelName;
} //recupère le nom du label en fonction de la couleur de l'item

function updateLabels() {
    const items = document.querySelectorAll('#list-container ul li');

    items.forEach((item) => {
        const itemBackground = item.style.background;
        const labelName = getLabelName(itemBackground);
        const labelDiv = item.querySelector('#label-modal p');

        labelDiv.innerText = labelName;
    });
}

function toggleInterface() { 
    const icon = newButton.firstElementChild;

    if (!inputContainer.classList.contains('open')) {
        inputContainer.classList.replace('closed', 'open'); //affiche l'input
        editContainer.classList.replace('hidden', 'visible'); //affiche les boutons d'éditions
        headerContainer.classList.replace('hidden', 'visible'); //affiche le header
        listContainer.classList.replace('hidden', 'visible'); //affiche la liste
        backgroundTitle.classList.replace('visible', 'hidden'); //masque le background
        icon.style.transform = 'rotateZ(45deg)'; //tourne le bouton + en x
    } else {
        inputContainer.classList.replace('open', 'closed'); //masque l'input
        editContainer.classList.replace('visible', 'hidden'); //masque les boutons d'éditions
        headerContainer.classList.replace('visible', 'hidden'); //masque le header
        listContainer.classList.replace('visible', 'hidden'); //masque la liste
        backgroundTitle.classList.replace('hidden', 'visible'); //affiche le background
        icon.style.transform = 'rotateZ(0)'; //tourne le bouton x en +

        setTimeout(() => { //reset couleur input
            input.style.background = "white";
        }, 200);
    }
} //affiche l'interface

function addItemOnClick() {
    if (input.value.length > 0) {
        createListItem();
    }
} //crée un item en cliquant sur le bouton check

function addItemOnEnter(event) {
    if (input.value.length > 0 && event.keyCode === 13) {
        createListItem();
    }
} //crée un item en appuyant sur entrée dans l'input

function activateColorButton(button) { 
    if (button === activeButton) {
        activeButton = null;
        button.classList.remove('is-active');
        input.style.background = "white";
    } else {
        if (activeButton) {
            activeButton.classList.remove('is-active');
        }

        activeButton = button;
        button.classList.add('is-active');
    }
} //active et désactive les boutons de sélection de couleur de l'input

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
    updateEditButtons();
}

function updateEditButtons() {
    if (listTitle.textContent.trim() === '' && ul.children.length === 0) {
        saveButton.classList.add("disabled");
        exportButton.classList.add("disabled");
        destroyButton.classList.add('disabled');
    } else {
        saveButton.classList.remove("disabled");
        exportButton.classList.remove("disabled");
        destroyButton.classList.remove('disabled');
    }
} //update boutons d'édition
//#endregion

//#region Item
function createListItem() {
    let gradientString = input.style.background; //récupère la couleur selectionnée
    
    while (!gradientString) {
        alert("You must choose a color.");
        return;
    }

    let li = document.createElement('li'); //créé le li
    addListItemEvents(li); //ajoute les listeners
    
    let colorRegex = /^linear-gradient\(to right, (.*?) /;
    li.style.background = gradientString.match(colorRegex)[1];
    
    if (importantButton.classList.contains('active')) {
        li.classList.toggle('important');
        importantButton.classList.toggle('active');
    }

    li.appendChild(document.createTextNode(input.value));
    
    addInfoButton(li);
    addDeleteButton(li);

    ul.appendChild(li);

    resetInput();
} //crée un item de liste

function addListItemEvents(li) {
    li.addEventListener('click', () => {
        li.classList.toggle('done');
    }); //click done

    li.addEventListener('mouseover', () => {
        let computedStyle = window.getComputedStyle(li);
        let color = computedStyle.getPropertyValue('background-color');
        let match = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        let rgba = match ? `rgba(${match[1]}, ${match[2]}, ${match[3]}, 0.3)` : color;

        li.style.boxShadow = `0 0 100px ${rgba}`;
    }); //effet hover

    li.addEventListener('mouseout', () => {
        li.style.boxShadow = "none";
    }); //effet exit hover
} //ajoute listeners aux items

function addInfoButton(li) {
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
    labelCircle.style.color = li.style.background;
    labelText.textContent = getLabelName(li.style.background);    

    dateDiv.id = "date-modal";

    if (pickedDateText.innerText.length > 0) {
        dateText.textContent = `Date: ${pickedDateText.innerText}`;
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
} //ajoute bouton info + modal

function showInfos(e, li) {
    e.stopPropagation();
    li.firstElementChild.classList.toggle('visible');
} //montre modal info

function addDeleteButton(li) {
    let deleteButton = document.createElement('button');

    deleteButton.id = 'delete-button';
    deleteButton.classList.add('fa-solid');
    deleteButton.classList.add('fa-trash');

    deleteButton.addEventListener('click', (e) => deleteItem(e, li));
    
    li.appendChild(deleteButton);
} //ajoute bouton delete

function deleteItem(e, li) {
    e.stopPropagation();

    li.removeEventListener('click', () => {
        li.classList.toggle('done');
    });

    li.classList.add('delete');

    li.addEventListener('animationend', () => {
        ul.removeChild(li);
    })
} //supprime item

function resetInput() {
    input.value = "";
    input.style.background = "white";
    activeButton.classList.remove('is-active');
    activeButton = null;
}
//#endregion

//#region SLIE System
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
}

function checkExisting(data, listData, labelData) {
    const existingList = JSON.parse(localStorage.getItem(`list-${activeList}`));
    
    if (existingList) {
        let hasChanged = false;

        data = existingList;
        
        data.items = data.items.filter(item => {
            return listData.some(newItem => newItem.text === item.text);
        });

        listData.forEach(newItem => {
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

        labelData.forEach(newLabel => {
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
    } else if (!activeList && ul.children.length !== 0) {
        addListToMenu(listTitle.innerText);
    }
} //update liste active

function addListToMenu(listTitle) {
    const li = document.createElement('li');

    li.innerHTML = `<a href="#">${listTitle}</a>`;
    activeList = `list-${listTitle}`;

    document.querySelector('#lists-menu-items').appendChild(li);
} //ajoute liste au menu

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
    }
}

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
}

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
} //remplace liste existante
//#endregion

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

function resetList() {
    activeList = "";
    activeButton.classList.remove("is-active");
    activeButton = null;
    listTitle.textContent = "";
    ul.innerHTML = "";
    input.style.background = "white";
    
    for (let i = 0; i < labelDivs.length; i++) {
        labelDivs[i].querySelector('p').textContent = `Label ${i + 1}`;
    }
} //reset liste