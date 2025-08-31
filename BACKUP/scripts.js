const todoList = document.getElementById("todo-list");
const addButton = document.getElementById("add-button");
const newTodoInput = document.getElementById("new-todo");

// ---- Persistencia en LocalStorage ----
function getTodosFromStorage() {
    const stored = localStorage.getItem("todos");
    return stored ? JSON.parse(stored) : [];
}

function saveTodosToStorage(todos) {
    localStorage.setItem("todos", JSON.stringify(todos));
}

// ---- Renderizar un todo en pantalla ----
function addTodoToDOM(text, completed = false) {
    const li = document.createElement("li");
    li.className = "todo-item";
    if (completed) li.classList.add("completed");

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

// ---- Refrescar lista completa desde storage ----
function renderTodos() {
    todoList.innerHTML = "";
    const todos = getTodosFromStorage();
    todos.forEach(todo => addTodoToDOM(todo.text, todo.completed));
}

// ---- Operaciones ----
function addTodo(text) {
    const todos = getTodosFromStorage();
    todos.push({ text, completed: false });
    saveTodosToStorage(todos);
    renderTodos();
}

function toggleTodoCompleted(target) {
    const item = target.closest(".todo-item");
    const text = item.querySelector("label").textContent;

    let todos = getTodosFromStorage();
    todos = todos.map(todo =>
        todo.text === text ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodosToStorage(todos);
    renderTodos();
}

function deleteTodoItem(target) {
    const item = target.closest(".todo-item");
    const text = item.querySelector("label").textContent;

    let todos = getTodosFromStorage();
    todos = todos.filter(todo => todo.text !== text);
    saveTodosToStorage(todos);
    renderTodos();
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
            let todos = getTodosFromStorage();
            const newText = input.value.trim();

            if (newText !== "") {
                todos = todos.map(todo =>
                    todo.text === currentText ? { ...todo, text: newText } : todo
                );
                saveTodosToStorage(todos);
                renderTodos();
            } else {
                // si queda vacío, se elimina
                todos = todos.filter(todo => todo.text !== currentText);
                saveTodosToStorage(todos);
                renderTodos();
            }
        } else if (e.key === "Escape") {
            renderTodos(); // cancelar edición y refrescar
        }
    });
}

// ---- Manejo de eventos ----
function handleAddButtonClick() {
    const text = newTodoInput.value.trim();
    if (text !== "") {
        addTodo(text);
        newTodoInput.value = "";
    }
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

// ---- Inicializar ----
renderTodos();