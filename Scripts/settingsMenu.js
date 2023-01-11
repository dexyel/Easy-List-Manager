const settingsButton = document.getElementById('settings-button');
const settingsContainer = document.getElementById('settings-container');

settingsButton.addEventListener('click', openSettings);

function openSettings() {
    if (settingsContainer.classList.contains('open')) {
        settingsContainer.classList.replace('open', 'closed');
    }
    else {
        settingsContainer.classList.replace('closed', 'open');
    }
}