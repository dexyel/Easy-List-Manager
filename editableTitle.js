const editTitle = document.querySelector(".edit-title");
const dataPlaceholder = document.querySelector(".data-placeholder");

editTitle.innerHTML === editTitle.getAttribute("data-placeholder");

document.addEventListener("DOMContentLoaded", loadTitle); 
editTitle.addEventListener('focus', onFocus);
editTitle.addEventListener('blur', onBlur);
editTitle.addEventListener('keydown', blockEnter);

function onFocus(event) {
    const value = event.target.innerHTML;

    value === dataPlaceholder && (event.target.innerHTML = '');
};

function onBlur(event) {
    const value = event.target.innerHTML;

    value === '' && (event.target.innerHTML = dataPlaceholder);
    saveTitle(editTitle.innerHTML);
};

function blockEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        saveTitle(editTitle.innerHTML);   
    }
};

function saveTitle(item) {
    let titleText = localStorage.getItem("title") === null ? [] : JSON.parse(localStorage.getItem("title"));

    titleText.push(item);
    localStorage.setItem("title", JSON.stringify(titleText));
}

function loadTitle() {
    let titleText = localStorage.getItem("title") === null ? [] : JSON.parse(localStorage.getItem("title"));
    
    editTitle.innerHTML = titleText[0];        
}