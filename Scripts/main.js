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
const labelLockSwitch = document.getElementById('label-lock-switch'); //bouton lock switch

/* MAIN */
const listContainer = document.getElementById('list-container'); //container liste
const ul = document.querySelector('#list-container ul'); //ul principal de la liste
const listTitle = document.getElementById('list-title'); //titre liste
const editContainer = document.getElementById('edit-container'); //container de l'interface
const saveButton = document.getElementById('save-button'); //bouton de sauvegarde
const destroyButton = document.getElementById('destroy-button'); //bouton de suppression de liste
const exportButton = document.getElementById('export-button'); //bouton d'export
const importButton = document.getElementById('import-button'); //bouton d'import
const listMenu = document.getElementById('lists-menu-items'); //menu de la liste
const newListButton = document.getElementById('new-list-button'); //bouton nouvelle liste
const filterButton = document.getElementById('filter-button'); //bouton filtre
const filterMenu = document.getElementById('filter-menu'); //menu des filtres
const cleanButton = document.getElementById('clean-button'); //bouton nettoyage done

/* INPUT */
const inputContainer = document.getElementById('new-container'); //container de l'input
const newButton = document.getElementById('new-todo-button'); //bouton +
const circles = document.querySelectorAll('#color-buttons button'); //boutons de selection des couleurs
const input = document.getElementById('todo-input'); //input
const enterButton = document.getElementById('enter-button'); //bouton de validation input
const importantButton = document.getElementById('important-button'); //bouton important
const calendarButton = document.getElementById('calendar-button'); //bouton du calendrier

let activeList = "";
let activeButton;
let labelLocked = false;
let activeFilter = null;
let filtersEventsInitiated = false;
//#endregion 

//#region EventListeners
enterButton.addEventListener('click', addItemOnClick);
input.addEventListener('keypress', addItemOnEnter);
newButton.addEventListener('click', toggleInterface);
settingsButton.addEventListener('click', openSettings);
cleanButton.addEventListener('click', removeDoneItems);
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

labelLockSwitch.addEventListener('change', (e) => {
    labelLocked = e.target.checked;
}); // verrouille/déverrouille la sélection du label
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

initials.forEach((initial) => {
    let randomIndex = Math.floor(Math.random() * colors.length);
    initial.style.color = colors[randomIndex]; 
}); //attribue une couleur aléatoire aux initiales des titres

activeList === "" ? destroyButton.classList.add('disabled') : destroyButton.classList.remove('disabled');
//active le bouton détruire si une liste est active, sinon le désactive

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
    const filters = filterMenu.querySelectorAll('span');

    items.forEach((item) => {
        const itemBackground = item.style.background;
        const labelName = getLabelName(itemBackground);
        const labelDiv = item.querySelector('#label-modal p');

        labelDiv.innerText = labelName;
    });

    filters.forEach((filter, index) => {
        filter.textContent = labelDivs[index].textContent;
    });
} //met à jour les labels des items

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
    } 
    else {
        if (activeButton) {
            activeButton.classList.remove('is-active');
        }

        activeButton = button;
        button.classList.add('is-active');
    }
} //active et désactive les boutons de sélection de couleur de l'input

function updateEditButtons() {
    if (listTitle.textContent.trim() === '' && ul.children.length === 0) {
        saveButton.classList.add("disabled");
        exportButton.classList.add("disabled");
        destroyButton.classList.add('disabled');
        cleanButton.classList.add('disabled');
        filterButton.classList.add('disabled');
    } else {
        saveButton.classList.remove("disabled");
        exportButton.classList.remove("disabled");
        destroyButton.classList.remove('disabled');
        cleanButton.classList.remove('disabled');
        filterButton.classList.remove('disabled');
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
} //ajoute des listeners aux items

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
} //ajoute un bouton info et son modal à l'item

function showInfos(e, li) {
    e.stopPropagation();
    li.firstElementChild.classList.toggle('visible');
} //montre le modal d'info de l'item

function addDeleteButton(li) {
    let deleteButton = document.createElement('button');

    deleteButton.id = 'delete-button';
    deleteButton.classList.add('fa-solid');
    deleteButton.classList.add('fa-trash');

    deleteButton.addEventListener('click', (e) => deleteItem(e, li));
    
    li.appendChild(deleteButton);
} //ajoute un bouton delete à l'item

function deleteItem(e, li) {
    e.stopPropagation();

    li.removeEventListener('click', () => {
        li.classList.toggle('done');
    });

    li.classList.add('delete');

    li.addEventListener('animationend', () => {
        ul.removeChild(li);
    })
} //supprime l'item

function removeDoneItems() {
    const doneItems = document.querySelectorAll('.done');

    doneItems.forEach((item) => {
        item.classList.add('delete');

        item.addEventListener('transitionend', () => {
            item.remove();
        });
    });
} //supprime tous les éléments done

function resetInput() {
    input.value = "";    

    if (activeButton !== null && !labelLocked) {
        activeButton.classList.remove("is-active");
        activeButton = null;
        input.style.background = "white";
    }

    if (!isPinned && calendarModal.classList.contains('modal')) {
        calendarModal.classList.toggle('modal');
        calendarButton.classList.toggle('calendar-active');
    }    

    resetPickedDate();
} //reset toutes les options d'input
//#endregion