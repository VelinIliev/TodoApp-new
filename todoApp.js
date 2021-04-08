let dom = {
    input: document.querySelector("input[type=text]"),
    btnAdd: document.querySelector('.todo-add-btn'),
    todoList: document.querySelector('.todo-items'),
    totalOutput: document.querySelector('.output'),
    completedOutput: document.querySelector('.output-completed'),
};

let todos = [];

function displayTodos() {
    dom.todoList.innerHTML = "";
    todos.forEach(el => {
        dom.todoList.innerHTML += `<li data-id=${el.id} class="${el.completed}">
                                    <span>${el.id}.</span>
                                    <span>${el.title}</span>
                                    <div class="removeTodo">
                                        <i class="far fa-trash-alt"></i>
                                    </div>
                                </li>`;
    });
    let count = 0;
    todos.forEach(el => {el.completed === "completed" ? count++ : count=count});
    dom.completedOutput.innerHTML = `${count}`;
    dom.totalOutput.innerHTML = `${todos.length}`;
};

function deleteTodos(findID) {
    let indexToFind = todos.findIndex(el => el.id === findID);
    todos.splice(indexToFind,1);
    displayTodos();
};

function markCompletedTodos(findID) {
    let i = todos.findIndex(el => el.id === findID);
    todos[i].completed === "completed" ? todos[i].completed = "" : todos[i].completed = "completed";
    displayTodos();
};

function createTodos() { 
    dom.input.value === "" ? alert("YOU CAN'T CREATE EMPTY TODO!") : 
    todos.length < 1 ? id = 1 : id = (todos[todos.length-1].id)*1+1;
    let newEl = {
        id: `${id}`,
        title: dom.input.value,
        completed: ""
    };
    todos = [...todos, newEl];
    displayTodos();
    dom.input.value = "";
};

dom.btnAdd.addEventListener('click', createTodos);

dom.input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        createTodos()
    }
});

dom.todoList.addEventListener('click', function(e){
        e.target.tagName === "I"    ?   deleteTodos(e.target.parentElement.parentElement.dataset.id)
    :   e.target.tagName === 'LI'   ?   markCompletedTodos(e.target.dataset.id)
    :   e.target.tagName === 'SPAN' ?   markCompletedTodos(e.target.parentElement.dataset.id)
    :   console.log("Задължително ли трябва да има else накрая?");
});