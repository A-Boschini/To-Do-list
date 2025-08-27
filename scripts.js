const todoList = document.getElementById("todo-list");
const addButton = document.getElementById("add-button");
const newTodoInput = document.getElementById("new-todo");

function addTodo(text, completed = false) {
    const li = document.createElement("li");
    li.className = "todo-item";
    if (completed) {
        li.classList.add("completed");
    }

    li.innerHTML = `
      <input type="checkbox" ${completed ? "checked" : ""} />
      <label>${text}</label>
      <div class="todo-actions">
          <div class="icon edit-icon">
              <img src="edit.svg" alt="Edit" />
          </div>
          <div class="icon delete-icon">
              <img src="delete.svg" alt="Delete" />
          </div>
      </div>
    `;

    todoList.appendChild(li);
}

function handleAddButtonClick() {
    const text = newTodoInput.value.trim();
    if (text !== "") {
        addTodo(text);
        newTodoInput.value = "";
    }
}

function toggleTodoCompleted(target) {
    const item = target.closest(".todo-item");
    item.classList.toggle("completed");
}

function deleteTodoItem(target) {
    const item = target.closest(".todo-item");
    item.remove();
}

function editTodoItem(target) {
    const item = target.closest(".todo-item");
    const label = item.querySelector("label");
    const currentText = label.textContent;

    const input = document.createElement("input");
    input.type = "text";
    input.value = currentText;
    input.className = "edit-input";

    item.replaceChild(input, label);
    input.focus();

    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            if (input.value.trim() !== "") {
                label.textContent = input.value.trim();
                item.replaceChild(label, input);
            } else {
                deleteTodoItem(target); // si deja vacío, se elimina
            }
        } else if (e.key === "Escape") {
            item.replaceChild(label, input); // cancelar edición
        }
    });
}

function handleTodoListClick(e) {
    const target = e.target;

    if (target.type === "checkbox") {
        toggleTodoCompleted(target);
    }

    if (target.closest(".delete-icon")) {
        deleteTodoItem(target);
    }

    if (target.closest(".edit-icon")) {
        editTodoItem(target);
    }
}

addButton.addEventListener("click", handleAddButtonClick);
todoList.addEventListener("click", handleTodoListClick);

// Mock todos iniciales
const mockTodos = [
    { text: "Buy Groceries", completed: false },
    { text: "Walk the dog", completed: true },
    { text: "Test", completed: false },
];

mockTodos.forEach(todo => addTodo(todo.text, todo.completed));
