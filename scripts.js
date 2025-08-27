const todoList = document.getElementById("todo-list");
const addButton = document.getElementById("add-button");
const newTodoInput = document.getElementById("new-todo");

// 🔹 Guardar en localStorage
function saveTodos() {
    const todos = [];
    document.querySelectorAll(".todo-item").forEach(item => {
        const text = item.querySelector("label").textContent;
        const completed = item.classList.contains("completed");
        todos.push({ text, completed });
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

// 🔹 Cargar de localStorage
function loadTodos() {
    const stored = localStorage.getItem("todos");
    if (stored) {
        const todos = JSON.parse(stored);
        todos.forEach(todo => addTodo(todo.text, todo.completed));
    }
}

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
    saveTodos(); // 🔹 Guardar cada vez que agrego
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
    saveTodos(); // 🔹 Guardar cambios
}

function deleteTodoItem(target) {
    const item = target.closest(".todo-item");
    item.remove();
    saveTodos(); // 🔹 Guardar cambios
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
                saveTodos(); // 🔹 Guardar cambios
            } else {
                deleteTodoItem(target);
            }
        } else if (e.key === "Escape") {
            item.replaceChild(label, input);
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

// 🔹 Cargar todos guardados al iniciar
loadTodos();
