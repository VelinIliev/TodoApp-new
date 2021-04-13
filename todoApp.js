let dom = {
    input: document.querySelector("input[type=text]"),
    btnAdd: document.querySelector('.todo-add-btn'),
    todoList: document.querySelector('.todo-items'),
    totalOutput: document.querySelector('.output'),
    completedOutput: document.querySelector('.output-completed'),
    btnClearCompleted: document.querySelector('.btnClearCompleted'),
};

let todos = [];
let count = 0;
let maxTodos = 10;

function displaySummary() {
    dom.completedOutput.innerHTML = `${count}`;
    dom.totalOutput.innerHTML = `${todos.length}`;
}

function displayTodos() {
    dom.todoList.innerHTML = "";
    todos.forEach(todo => {
        dom.todoList.innerHTML +=   `<li data-id=${todo.id} class="${todo.completed}">
                                        <span>${todo.id}.</span>
                                        <span>${todo.title}</span>
                                        <div class="removeTodo">
                                            <i class="far fa-trash-alt"></i>
                                        </div>
                                    </li>`;
    });

    count = 0;
    todos.forEach(todo => {count = (todo.completed === "completed") ? count+1 : count;});
    displaySummary()
};
function createTodos() { 
    if (dom.input.value === "") {
        alert("YOU CAN'T CREATE EMPTY TODO!");
    } else if (todos.length === maxTodos ){
        alert("YOU CAN'T CREATE MORE TODOS!");
    } else {
        let id = (todos.length < 1) ?  1 : (todos[todos.length-1].id)*1+1;
        let newEl = {
            id: id,
            title: dom.input.value,
            completed: "",
        };
        todos = [...todos, newEl];
    }
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
    let i = todos.findIndex(todo => todo.id === findID*1);
    todos[i].completed = (todos[i].completed === "completed") ? "" : "completed";
    displayTodos();
    dom.btnClearCompleted.classList.remove('hidden');
};

function clearCompletedTodos() {
    let indexToRemove = [];
    todos.forEach(todo =>   {indexToRemove = (todo.completed === "completed") ? 
                            [...indexToRemove, todos.findIndex( find => find.id === todo.id)] 
                            : [...indexToRemove]});
    while(indexToRemove.length) {
        todos.splice(indexToRemove.pop(), 1);
    };
    displayTodos();
    dom.btnClearCompleted.classList.add('hidden');
}

displaySummary();

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