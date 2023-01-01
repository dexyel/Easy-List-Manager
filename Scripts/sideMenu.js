const bars = document.querySelector(".fa-bars");
const sideMenu = document.querySelector(".side-menu");

bars = addEventListener('click', rotateButton);
document = addEventListener("DOMContentLoaded", createSideList);


    

    


function rotateButton(event) {
    event.preventDefault();
    const lists = localStorage.getItem('title');
    console.log(lists);
    let item = event.target;
    
    if (item.classList.contains("fa-bars")) {
        if (bars.classList.contains("closed")) {
            bars.classList.remove("closed");
            bars.classList.add("opened");

            sideMenu.classList.add("visible");
        }
        else {
            bars.classList.remove("opened");
            bars.classList.add("closed");

            sideMenu.classList.remove("visible");
        }
    }
}