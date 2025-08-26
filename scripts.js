const todoList = document.getElementById("todolist");
const addButton = document.getElementById("add-button");
const newTodoInput = document.getElementById("new-todo");

function addTodo(text, completed =false) {
    const li = document.createElement("li");
    li.className = "todo-item";
    if(completed) {
        li.classList.add("completed");
    }
}
