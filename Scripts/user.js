const userText = document.querySelector(".user-text");
const userButton = document.querySelector(".fa-user-large");
const userModal = document.querySelector(".user-modal");

let userList = ["Guest"];
let userLoaded = "";

document = addEventListener('DOMContentLoaded', getUser);
userButton = addEventListener('click', openUserModal);

function getUser() {
    userText.innerHTML = userList[0];
}

function openUserModal(event) {
    event.preventDefault();

    const container = document.querySelector(".container");
    const overlay = document.createElement("div");

    let button = event.target; 
    
    if (button.classList.contains("fa-user-large") || button.classList.contains("fa-xmark")) {
        
        if (!userModal.classList.contains("modal-opened"))
        {
            userModal.classList.add("modal-opened");            
            
            overlay.classList.toggle("modal-overlay");
            container.appendChild(overlay);
        }
        else
        {
            container.removeChild(container.lastChild);
            userModal.classList.remove("modal-opened");            
        }
        
        
        
        
    }
}