const addTaskButton = document.querySelector("#add-task-button");
const taskFormSection = document.querySelector("#task-form-section");
const taskForm = document.querySelector("#task-form");
const closeFormButton = document.querySelector("#close-form-button");

const taskTitleInput = document.querySelector("#task-title");
const taskSubjectInput = document.querySelector("#task-subject");
const taskDueDateInput = document.querySelector("#task-due-date");
const taskPriorityInput = document.querySelector("#task-priority");
const taskStatusInput = document.querySelector("#task-status");

const taskList = document.querySelector("#task-list");
const emptyMessage = document.querySelector("#empty-message");

const totalTasksElement = document.querySelector("#total-tasks");
const pendingTasksElement = document.querySelector("#pending-tasks");
const completedTasksElement = document.querySelector("#completed-tasks");

const tasks = [];

function updateDashboard() {
  const completedTasks = tasks.filter(function (task) {
    return task.status === "completed";
  }).length;

  const pendingTasks = tasks.length - completedTasks;

  totalTasksElement.textContent = tasks.length;
  pendingTasksElement.textContent = pendingTasks;
  completedTasksElement.textContent = completedTasks;
}

function formatText(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function renderTasks() {
  taskList
    .querySelectorAll(".task-card")
    .forEach(function (taskCard) {
      taskCard.remove();
    });

  if (tasks.length === 0) {
    emptyMessage.classList.remove("hidden");
  } else {
    emptyMessage.classList.add("hidden");
  }

  tasks.forEach(function (task) {
    const taskCard = document.createElement("article");

    taskCard.className = "task-card";

    taskCard.innerHTML = `
      <div class="task-card-heading">
        <div>
          <h3>${task.title}</h3>
          <p>${task.subject}</p>
        </div>

        <span class="priority-badge priority-${task.priority}">
          ${formatText(task.priority)} Priority
        </span>
      </div>

      <div class="task-details">
        <p>
          <strong>Due date:</strong>
          ${task.dueDate}
        </p>

        <p>
          <strong>Status:</strong>
          ${formatText(task.status)}
        </p>
      </div>
    `;

    taskList.appendChild(taskCard);
  });

  updateDashboard();
}

function openTaskForm() {
  taskFormSection.classList.remove("hidden");
  taskTitleInput.focus();
}

function closeTaskForm() {
  taskFormSection.classList.add("hidden");
  taskForm.reset();
}

function createTask(event) {
  event.preventDefault();

  const newTask = {
    id: Date.now(),
    title: taskTitleInput.value.trim(),
    subject: taskSubjectInput.value.trim(),
    dueDate: taskDueDateInput.value,
    priority: taskPriorityInput.value,
    status: taskStatusInput.value
  };

  tasks.push(newTask);

  renderTasks();
  closeTaskForm();
}

addTaskButton.addEventListener("click", openTaskForm);
closeFormButton.addEventListener("click", closeTaskForm);
taskForm.addEventListener("submit", createTask);

renderTasks();