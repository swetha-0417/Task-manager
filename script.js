
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const category = document.querySelector("#category");
const priority = document.querySelector("#priority");
const dueDate = document.querySelector("#due-date");
const list = document.querySelector("#task-list");
const search = document.querySelector("#search");
const submitBtn = document.querySelector("#submit-btn");
const emptyMessage = document.querySelector("#empty-message");

// Load saved tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let editingId = null;

// Save tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks
function renderTasks() {
    list.innerHTML = "";

    const searchText = search.value.toLowerCase();

    const filteredTasks = tasks.filter(function(task) {
        return task.text.toLowerCase().includes(searchText);
    });

    filteredTasks.forEach(function(task) {

        const card = document.createElement("div");
        card.className = "task-card " + task.priority.toLowerCase();

        const heading = document.createElement("h3");
        heading.textContent = task.text;

        const categoryText = document.createElement("p");
        categoryText.textContent = "Category: " + task.category;

        const priorityText = document.createElement("p");
        priorityText.textContent = "Priority: " + task.priority;

        const dateText = document.createElement("p");
        dateText.textContent = "Due Date: " + task.dueDate;

        const actions = document.createElement("div");
        actions.className = "actions";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";
        editBtn.dataset.id = task.id;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.dataset.id = task.id;

        actions.append(editBtn, deleteBtn);

        card.append(
            heading,
            categoryText,
            priorityText,
            dateText,
            actions
        );

        list.append(card);
    });

    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";
}

// Add or update task
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const text = input.value.trim();

    if (!text || !dueDate.value) return;

    if (editingId !== null) {

        const task = tasks.find(task => task.id === editingId);

        if (task) {
            task.text = text;
            task.category = category.value;
            task.priority = priority.value;
            task.dueDate = dueDate.value;
        }

        editingId = null;
        submitBtn.textContent = "Add Task";

    } else {

        const newTask = {
            id: Date.now(),
            text: text,
            category: category.value,
            priority: priority.value,
            dueDate: dueDate.value
        };

        tasks.push(newTask);
    }

    saveTasks();
    renderTasks();
    form.reset();
});

// Edit and delete tasks
list.addEventListener("click", function(e) {

    const id = Number(e.target.dataset.id);

    if (!id) return;

    if (e.target.classList.contains("delete-btn")) {

        tasks = tasks.filter(task => task.id !== id);

        if (editingId === id) {
            editingId = null;
            form.reset();
            submitBtn.textContent = "Add Task";
        }

    }

    else if (e.target.classList.contains("edit-btn")) {

        const task = tasks.find(task => task.id === id);

        if (!task) return;

        input.value = task.text;
        category.value = task.category;
        priority.value = task.priority;
        dueDate.value = task.dueDate;

        editingId = id;
        submitBtn.textContent = "Update Task";

        input.focus();
    }

    saveTasks();
    renderTasks();
});

// Search tasks
search.addEventListener("input", renderTasks);

// Display saved tasks on page load
renderTasks();
