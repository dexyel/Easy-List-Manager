const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOptions = document.querySelector(".filter-todo");

document.addEventListener("DOMContentLoaded", loadLocalTodos); 
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteChecked);
filterOptions.addEventListener('click', filterTodo);

function addTodo(event)
{
    event.preventDefault();    

    const todoDiv = document.createElement('div');
    todoDiv.classList.add("todo");

    const todoLi = document.createElement('li');
    todoLi.classList.add("todo-item");
    todoLi.innerText = todoInput.value;
    todoDiv.appendChild(todoLi);

    saveLocalTodo(todoInput.value);

    const todoChecked = document.createElement('button');
    todoChecked.classList.add("todo-checked");
    todoChecked.innerHTML = '<i class="fa-solid fa-check" id="checkIcon"></i>';
    todoDiv.appendChild(todoChecked);

    const todoDelete = document.createElement('button');
    todoDelete.classList.add("todo-delete");
    todoDelete.innerHTML = '<i class="fa-solid fa-trash" id="deleteIcon"></i>';
    todoDiv.appendChild(todoDelete);

    todoList.appendChild(todoDiv);
    todoInput.value = "";
}

function deleteChecked(event)
{
    const item = event.target;
    
    if (item.classList[0] === "todo-delete")
    {
        const todo = item.parentElement;
        todo.classList.add("deleted");
        removeLocalTodosItem(todo);
        todo.addEventListener("transitionend", () => todo.remove());
    }

    if (item.classList[0] === "todo-checked")
    {
        const todo = item.parentElement;
        todo.classList.toggle("completed");
    }
}

function filterTodo(event) {
    const todos = todoList.childNodes;
    
    todos.forEach(function(todo) {
        switch (filterOptions.value)
        {
            case "finished":
                todo.style.display = todo.classList.contains('completed') ? "flex" : "none";                
                break;

            case "unfinished":
                todo.style.display = !todo.classList.contains('completed') ? "flex" : "none";
                break;

            case "all":
            default:
                todo.style.display = "flex";
                break;
        }
    });
}

function saveLocalTodo(item) {
    let todos = localStorage.getItem('todos') === null ? [] : JSON.parse(localStorage.getItem('todos'));

    todos.push(item);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadLocalTodos() {
    let todos = localStorage.getItem('todos') === null ? [] : JSON.parse(localStorage.getItem('todos'));

    todos.forEach(function(todo) {
        const todoDiv = document.createElement('div');
        todoDiv.classList.add("todo");

        const todoLi = document.createElement('li');
        todoLi.classList.add("todo-item");
        todoLi.innerText = todo;
        todoDiv.appendChild(todoLi);

        const todoChecked = document.createElement('button');
        todoChecked.classList.add("todo-checked");
        todoChecked.innerHTML = '<i class="fa-solid fa-check"></i>';
        todoDiv.appendChild(todoChecked);

        const todoDelete = document.createElement('button');
        todoDelete.classList.add("todo-delete");
        todoDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';
        todoDiv.appendChild(todoDelete);

        todoList.appendChild(todoDiv);
    });
}

function removeLocalTodosItem(todo) {
    let todos = localStorage.getItem('todos') === null ? [] : JSON.parse(localStorage.getItem('todos'));

    const item = todo.children[0].innerText;
    todos.splice(todos.indexOf(item), 1);

    localStorage.setItem('todos', JSON.stringify(todos));
}
