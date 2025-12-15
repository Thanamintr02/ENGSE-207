// app.js - Frontend Logic
// ENGSE207 Software Architecture - Week 3 Lab

// ========================================
// PART 1: STATE MANAGEMENT
// ========================================
let allTasks = [];
let currentFilter = "ALL";

// ========================================
// PART 2: DOM ELEMENTS
// ========================================
const addTaskForm = document.getElementById("addTaskForm");
const statusFilter = document.getElementById("statusFilter");
const loadingOverlay = document.getElementById("loadingOverlay");

// Task list containers
const todoTasks = document.getElementById("todoTasks");
const progressTasks = document.getElementById("progressTasks");
const doneTasks = document.getElementById("doneTasks");

// Task counters
const todoCount = document.getElementById("todoCount");
const progressCount = document.getElementById("progressCount");
const doneCount = document.getElementById("doneCount");

// ========================================
// PART 3: API FUNCTIONS - FETCH TASKS
// ========================================
async function fetchTasks() {
  showLoading();
  try {
    const response = await fetch("/api/tasks");
    const data = await response.json();
    allTasks = data.data;
    renderTasks();
  } catch (error) {
    alert("Failed to load tasks.");
    console.error(error);
  } finally {
    hideLoading();
  }
}

// ========================================
// PART 4: API FUNCTIONS - CREATE TASK
// ========================================
async function createTask(taskData) {
  showLoading();
  try {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) throw new Error("Create failed");

    const newTask = await response.json();

    // Backend returns only { id }, now fetch full list again
    await fetchTasks();

    addTaskForm.reset();
    alert("Task created successfully!");
  } catch (error) {
    alert("Error creating task.");
    console.error(error);
  } finally {
    hideLoading();
  }
}

// ========================================
// PART 5: API FUNCTIONS - UPDATE STATUS
// ========================================
async function updateTaskStatus(taskId, newStatus) {
  showLoading();
  try {
    const response = await fetch(`/api/tasks/${taskId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) throw new Error("Update failed");

    await fetchTasks();
  } catch (error) {
    alert("Failed to update status.");
    console.error(error);
  } finally {
    hideLoading();
  }
}

// ========================================
// PART 6: API FUNCTIONS - DELETE TASK
// ========================================
async function deleteTask(taskId) {
  if (!confirm("Are you sure?")) return;

  showLoading();
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Delete failed");

    allTasks = allTasks.filter((t) => t.id !== taskId);
    renderTasks();
    alert("Task deleted.");
  } catch (error) {
    alert("Failed to delete task.");
    console.error(error);
  } finally {
    hideLoading();
  }
}

// ========================================
// PART 7: MAIN RENDER FUNCTION
// ========================================
function renderTasks() {
  todoTasks.innerHTML = "";
  progressTasks.innerHTML = "";
  doneTasks.innerHTML = "";

  let filtered = allTasks;
  if (currentFilter !== "ALL") {
    filtered = allTasks.filter((t) => t.status === currentFilter);
  }

  const todo = filtered.filter((t) => t.status === "TODO");
  const progress = filtered.filter((t) => t.status === "IN_PROGRESS");
  const done = filtered.filter((t) => t.status === "DONE");

  todoCount.textContent = todo.length;
  progressCount.textContent = progress.length;
  doneCount.textContent = done.length;

  renderTaskList(todo, todoTasks, "TODO");
  renderTaskList(progress, progressTasks, "IN_PROGRESS");
  renderTaskList(done, doneTasks, "DONE");
}

// ========================================
// PART 8: RENDER TASK LIST
// ========================================
function renderTaskList(tasks, container, currentStatus) {
  if (tasks.length === 0) {
    container.innerHTML = `<p class="empty-state">No tasks</p>`;
    return;
  }

  tasks.forEach((task) =>
    container.appendChild(createTaskCard(task, currentStatus))
  );
}

// ========================================
// PART 9: TASK CARD COMPONENT
// ========================================
function createTaskCard(task, currentStatus) {
  const card = document.createElement("div");
  card.className = "task-card";

  const priorityClass = `priority-${task.priority?.toLowerCase() || "low"}`;

  card.innerHTML = `
        <div class="task-header">
            <h4>${escapeHtml(task.title)}</h4>
            <span class="priority-badge ${priorityClass}">${
    task.priority
  }</span>
        </div>
        ${task.description ? `<p>${escapeHtml(task.description)}</p>` : ""}
        <small>Created: ${formatDate(task.created_at)}</small>

        <div class="task-actions">
            ${createStatusButtons(task.id, currentStatus)}
            <button class="btn btn-danger btn-sm" onclick="deleteTask(${
              task.id
            })">🗑 Delete</button>
        </div>
    `;

  return card;
}

// ========================================
// PART 10: STATUS BUTTONS GENERATOR
// ========================================
function createStatusButtons(taskId, currentStatus) {
  const btn = [];

  if (currentStatus !== "TODO") {
    btn.push(
      `<button class="btn btn-warning btn-sm" onclick="updateTaskStatus(${taskId}, 'TODO')">← To Do</button>`
    );
  }
  if (currentStatus !== "IN_PROGRESS") {
    btn.push(
      `<button class="btn btn-info btn-sm" onclick="updateTaskStatus(${taskId}, 'IN_PROGRESS')">→ In Progress</button>`
    );
  }
  if (currentStatus !== "DONE") {
    btn.push(
      `<button class="btn btn-success btn-sm" onclick="updateTaskStatus(${taskId}, 'DONE')">✔ Done</button>`
    );
  }

  return btn.join("");
}

// ========================================
// PART 11: UTILITIES
// ========================================
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString();
}

function showLoading() {
  loadingOverlay.style.display = "flex";
}
function hideLoading() {
  loadingOverlay.style.display = "none";
}

// ========================================
// PART 12: EVENT LISTENERS
// ========================================
addTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("taskTitle").value.trim();
  const description = document.getElementById("taskDescription").value.trim();
  const priority = document.getElementById("taskPriority").value;

  if (!title) return alert("Please enter a title");

  createTask({ title, description, priority });
});

statusFilter.addEventListener("change", (e) => {
  currentFilter = e.target.value;
  renderTasks();
});

// ========================================
// PART 13: INITIALIZATION
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  console.log("Task board initialized.");
  fetchTasks();
});

// ========================================
// PART 14: GLOBAL
// ========================================
window.updateTaskStatus = updateTaskStatus;
window.deleteTask = deleteTask;
