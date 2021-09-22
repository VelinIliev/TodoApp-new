const inputTodo = document.querySelector("input[type=text]");
const btnAdd = document.querySelector('.todo-add-btn');
const todoList = document.querySelector('.todo-items');
const btnClearCompleted = document.querySelector('.btnClearCompleted');
const inputRadio = document.querySelectorAll('[name="filter"]');

const apiURL = './db-localstorage.json'

const maxTodos = 20;
let count = 0;
let todos = [];

const saveToLocalStorage = () => localStorage.setItem("todos", JSON.stringify(todos));

function startingTasks() {
    if (localStorage.getItem("todos") === null 
        || JSON.parse(localStorage.getItem('todos')).length === 0 ) {
        fetch(`${apiURL}`) 
        .then(response => response.json())
        .then(data => {
            todos = data;
            saveToLocalStorage();
            displayTodos();
        })
        .catch(err => console.log(err))
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
        displayTodos();
    }
    
};

function getCurrentTimeAndDate() {
    let time = new Date();
    let seconds = time.getSeconds() < 10 ? "0"+time.getSeconds() : time.getSeconds();
    let minutes = time.getMinutes() < 10 ? "0"+time.getMinutes() : time.getMinutes();
    let hours = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
    let month = time.getMonth() < 10 ? "0" + (time.getMonth()+1) : time.getMonth()+1;
    let day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
    let year = time.getFullYear();
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

function displaySummary() {
    const completedOutput = document.querySelector('.output-completed');
    const totalOutput = document.querySelector('.output'); 

    completedOutput.innerHTML = `${count}`;
    totalOutput.innerHTML = `${todos.length}`;
};

function checkForFilter() {
    let chekcedRadio;
    inputRadio.forEach( (el) => { 
        if (el.checked) { 
            chekcedRadio = el.value;
        } 
    });
    return chekcedRadio    
};

function displayTodos() {
    todoList.innerHTML = "";
    let filter = checkForFilter();
    let numeration = 1;

    todos.forEach(todo => {
        let todoItems =   `<li data-id=${todo.id} class="${todo.status}">
                                <span>${numeration++}.</span>
                                <span>${todo.title}</span>
                                <div class="removeTodo">
                                    <i class="far fa-trash-alt"></i>
                                </div>
                                <span class="created">${todo.created}</span>
                            </li>`;
        if (checkForFilter() === 'all') {
        todoList.innerHTML += todoItems;
        } else if (todo.status === filter) {
            todoList.innerHTML +=  todoItems;
        };
    });

    count = 0;
    
    todos.forEach(todo => {count = (todo.status === "completed") ? count+1 : count;});
    if (count > 0) {
        btnClearCompleted.classList.remove('hidden');
    } else {
        btnClearCompleted.classList.add('hidden');
    };
    displaySummary();
};

function createTodos() {
    if (inputTodo.value === "") {
        alert("YOU CAN'T CREATE EMPTY TODO!");
    } else if (todos.length >= maxTodos){
        alert("YOU CAN'T CREATE MORE TODOS!");
    }
    else {
        let randomID = Math.floor(Math.random()*10000000)
        let newTodo = {
            id: randomID,
            title: inputTodo.value,
            status: "active",
            created: getCurrentTimeAndDate(),
        };
        todos = [...todos, newTodo];
        saveToLocalStorage()
        displayTodos();
    };
    inputTodo.value = "";
    inputTodo.focus();
};

function deleteTodos(findID) {
    let indexToFind = todos.findIndex(todo => todo.id === findID*1);
    todos.splice(indexToFind, 1);
    saveToLocalStorage();
    displayTodos();
};

function markCompletedTodos(findID) {
    let i = todos.findIndex(todos => todos.id === findID*1);
    todos[i].status = (todos[i].status === "completed") ? "active" : "completed";
    saveToLocalStorage();
    displayTodos();
};

function clearCompletedTodos() {
    let indexToRemove = [];
    todos.forEach(todo =>  { indexToRemove = (todo.status === "completed") 
                            ? [...indexToRemove, todos.findIndex( find => find.id === todo.id)] 
                            : [...indexToRemove]; 
                            });
    while(indexToRemove.length) {
        todos.splice(indexToRemove.pop(), 1);
    };
    saveToLocalStorage();
    displayTodos();
};

window.addEventListener('DOMContentLoaded', startingTasks);

btnAdd.addEventListener('click', createTodos);

inputTodo.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        createTodos();
    }
});

todoList.addEventListener('click', function(e){
    switch (e.target.tagName) {
        case "I"    : deleteTodos(e.target.parentElement.parentElement.dataset.id); break;
        case 'DIV'  : deleteTodos(e.target.parentElement.dataset.id); break; 
        case 'LI'   : markCompletedTodos(e.target.dataset.id); break;
        case 'SPAN' : markCompletedTodos(e.target.parentElement.dataset.id); break;
        default     : console.error("Something went wrong!")
    }
});

btnClearCompleted.addEventListener('click', clearCompletedTodos);

inputRadio.forEach(function(e) {
    e.addEventListener("click", displayTodos)
});
