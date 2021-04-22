let dom = {
    inputTodo: document.querySelector("input[type=text]"),
    btnAdd: document.querySelector('.todo-add-btn'),
    todoList: document.querySelector('.todo-items'),
    totalOutput: document.querySelector('.output'),
    completedOutput: document.querySelector('.output-completed'),
    btnClearCompleted: document.querySelector('.btnClearCompleted'),
    inputRadio: document.querySelectorAll('[name="filter"]'),
    allRadio: document.getElementById('all'),
    completedRadio: document.getElementById('completed-radio'),
    activeRadio: document.getElementById('active'),
};

const apiURL = 'http://localhost:3000/todos';
const maxTodos = 10;
let count = 0;
let todos = [];

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
    dom.completedOutput.innerHTML = `${count}`;
    dom.totalOutput.innerHTML = `${todos.length}`;
};

function checkForFilter() {
    if (dom.allRadio.checked) {
        return dom.allRadio.value;
    } else if (dom.completedRadio.checked) {
        return dom.completedRadio.value;
    } else if (dom.activeRadio.checked) {
        return dom.activeRadio.value;
    } else {
        return "all";
    }
};

function displayTodos() {
    dom.todoList.innerHTML = "";
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
        if (filter === 'all') {
        dom.todoList.innerHTML += todoItems;
        } else if (todo.status === filter) {
            dom.todoList.innerHTML +=  todoItems;
        };
    });

    count = 0;
    todos.forEach(todo => {count = (todo.status === "completed") ? count+1 : count;});
    if (count>0) {
        dom.btnClearCompleted.classList.remove('hidden');
    } else {
        dom.btnClearCompleted.classList.add('hidden');
    };
    displaySummary();
};

function createTodos() {
    getCurrentTimeAndDate();
    if (dom.inputTodo.value === "") {
        alert("YOU CAN'T CREATE EMPTY TODO!");
    } else if (todos.length >= maxTodos){
        alert("YOU CAN'T CREATE MORE TODOS!");
    }
    else {
        let newTodo = {
            title: dom.inputTodo.value,
            status: "active",
            created: getCurrentTimeAndDate(),
        };
        fetch(`${apiURL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTodo) 
        })
    };
    dom.inputTodo.value = "";
    dom.inputTodo.focus();
};

function deleteTodos(id) {
    fetch(`${apiURL}/${id}`, {
        method: 'DELETE',
    });
};

function markCompletedTodos(id) {
    let statusTmp;
    fetch(`${apiURL}/${id}`)
    .then(response => response.json())
    .then(data => {
        statusTmp = (data.status === "completed") ? "active" : "completed";
        goForward(statusTmp);
    })
    function goForward(statusTmp) {
        fetch(`${apiURL}/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                status: `${statusTmp}`
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }) 
    }
};

function clearCompletedTodos() {
    let idToRemove = [];
    todos.forEach(todo =>   { idToRemove = (todo.status === "completed") ? 
                            [...idToRemove, todo.id] : [...idToRemove] } );
    while(idToRemove.length) {
        fetch(`${apiURL}/${idToRemove.pop()}`, {
            method: 'DELETE'
        })
    };
};

window.addEventListener('DOMContentLoaded', function() {
    fetch(`${apiURL}`) 
    .then(response => response.json())
    .then(data => {
        todos = data;
        displayTodos();
    })
    // .then( () => displayTodos() )
    .catch(err => console.log(err))
});

dom.btnAdd.addEventListener('click', createTodos);

dom.inputTodo.addEventListener('keypress', function(e) {
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
        // getAttribute('id')
    }
});

dom.btnClearCompleted.addEventListener('click', clearCompletedTodos);

dom.inputRadio.forEach(function(e){
    e.addEventListener("click", displayTodos)
});