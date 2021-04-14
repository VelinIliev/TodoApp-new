let dom = {
    input: document.querySelector("input[type=text]"),
    btnAdd: document.querySelector('.todo-add-btn'),
    todoList: document.querySelector('.todo-items'),
    totalOutput: document.querySelector('.output'),
    completedOutput: document.querySelector('.output-completed'),
    btnClearCompleted: document.querySelector('.btnClearCompleted'),
    inputRadio: document.querySelectorAll('[name="filter"]'),
    all: document.getElementById('all'),
    completedRadio: document.getElementById('completed-radio'),
    active: document.getElementById('active'),
};

let count = 0;
let maxTodos = 10;
// let localStorage = window.localStorage;
let todos = JSON.parse(localStorage.getItem('todos')) || [];

function displaySummary() {
    dom.completedOutput.innerHTML = `${count}`;
    dom.totalOutput.innerHTML = `${todos.length}`;
};

function saveToLocalStorage() {
    localStorage.setItem('todos',JSON.stringify(todos));
};

function checkForFilter() {
    if (dom.all.checked) {
        return dom.all.value;
    } else if (dom.completedRadio.checked) {
        return dom.completedRadio.value;
    } else if (dom.active.checked) {
        return dom.active.value;
    } else {
        return "all";
    }
};

function displayTodos() {
    let filter = checkForFilter();
    dom.todoList.innerHTML = "";
    let numeration = 1;
    todos.forEach(todo => {
        let innerHtmlLI =   `<li data-id=${todo.id} class="${todo.status}">
                                <span>${numeration++}.</span>
                                <span>${todo.title}</span>
                                <div class="removeTodo">
                                    <i class="far fa-trash-alt"></i>
                                </div>
                            </li>`;
        if (filter === 'all') {
        dom.todoList.innerHTML += innerHtmlLI;
        } else if (todo.status === filter) {
            dom.todoList.innerHTML +=  innerHtmlLI;
        };
    });
    count = 0;
    todos.forEach(todo => {count = (todo.status === "completed") ? count+1 : count;});
    if (count>0) {
        dom.btnClearCompleted.classList.remove('hidden');
    } else {
        dom.btnClearCompleted.classList.add('hidden');
    };
    saveToLocalStorage();
    displaySummary();
};

function createTodos() { 
    if (dom.input.value === "") {
        alert("YOU CAN'T CREATE EMPTY TODO!");
    } else if (todos.length === maxTodos ){
        alert("YOU CAN'T CREATE MORE TODOS!");
    } else {
        let id = (todos.length < 1) ?  1 : (todos[todos.length-1].id)*1+1;
        let newTodo = {
            id: id,
            title: dom.input.value,
            status: "active",
        };
        todos = [...todos, newTodo];
    };
    displayTodos();
    dom.input.value = "";
    dom.input.focus();
};

function deleteTodos(findID) {
    let indexToFind = todos.findIndex(todo => todo.id === findID*1);
    todos.splice(indexToFind, 1);
    displayTodos();
};

function markCompletedTodos(findID) {
    let indexToFind = todos.findIndex(todo => todo.id === findID*1);
    todos[indexToFind].status = (todos[indexToFind].status === "completed") 
                                ? "active" : "completed";
    displayTodos(); 
};

function clearCompletedTodos() {
    let indexToRemove = [];
    todos.forEach(todo =>   {indexToRemove = (todo.status === "completed") ? 
                            [...indexToRemove, todos.findIndex(find => find.id === todo.id)] 
                            : [...indexToRemove]});
    while(indexToRemove.length) {
        todos.splice(indexToRemove.pop(), 1);
    };
    displayTodos();
};

window.addEventListener('DOMContentLoaded', displayTodos);

dom.btnAdd.addEventListener('click', createTodos);
dom.input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        createTodos();
    }
});

dom.todoList.addEventListener('click', function(e){
    switch (e.target.tagName) {
        case "I"    : deleteTodos(e.target.parentElement.parentElement.dataset.id); break;
        case 'DIV'  : deleteTodos(e.target.parentElement.dataset.id); break;
        case 'LI'   : markCompletedTodos(e.target.dataset.id); break;
        case 'SPAN' : markCompletedTodos(e.target.parentElement.dataset.id); break;
        default     : console.error("Something went wrong!")
    }
});

dom.btnClearCompleted.addEventListener('click', clearCompletedTodos);

dom.inputRadio.forEach(function(e){
    e.addEventListener("click", displayTodos)
});