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
const formTitle = document.querySelector("#form-title");
const saveTaskButton = document.querySelector("#save-task-button");

let editingTaskId = null;
let tasks = JSON.parse(localStorage.getItem("teachflowTasks")) || [];
function saveTasks() {
  localStorage.setItem("teachflowTasks", JSON.stringify(tasks));
}
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
      <div class="task-actions">
  <button
    class="edit-button"
    data-id="${task.id}"
    type="button"
  >
    Edit
  </button>

  <button
    class="status-button"
    data-id="${task.id}"
    type="button"
  >
    ${task.status === "completed" ? "Mark Pending" : "Mark Complete"}
  </button>

  <button
    class="delete-button"
    data-id="${task.id}"
    type="button"
  >
    Delete
  </button>
</div>
    `;

    taskList.appendChild(taskCard);
  });

  updateDashboard();
}

function openTaskForm() {
  editingTaskId = null;

  formTitle.textContent = "Add Teaching Task";
  saveTaskButton.textContent = "Save Task";

  taskForm.reset();
  taskStatusInput.value = "pending";

  taskFormSection.classList.remove("hidden");
  taskTitleInput.focus();
}

function closeTaskForm() {
  editingTaskId = null;

  formTitle.textContent = "Add Teaching Task";
  saveTaskButton.textContent = "Save Task";

  taskFormSection.classList.add("hidden");
  taskForm.reset();
  taskStatusInput.value = "pending";
}

function createTask(event) {
  event.preventDefault();

  const taskData = {
    title: taskTitleInput.value.trim(),
    subject: taskSubjectInput.value.trim(),
    dueDate: taskDueDateInput.value,
    priority: taskPriorityInput.value,
    status: taskStatusInput.value
  };

  if (editingTaskId !== null) {
    tasks = tasks.map(function (task) {
      if (Number(task.id) === editingTaskId) {
        return {
          ...task,
          ...taskData
        };
      }

      return task;
    });
  } else {
    const newTask = {
      id: Date.now(),
      ...taskData
    };

    tasks.push(newTask);
  }

  saveTasks();
  renderTasks();
  closeTaskForm();
}
function deleteTask(taskId) {
  tasks = tasks.filter(function (task) {
    return Number(task.id) !== taskId;
  });

  saveTasks();
  renderTasks();
}
function toggleTaskStatus(taskId) {
  tasks = tasks.map(function (task) {
    if (Number(task.id) === taskId) {
      return {
        ...task,
        status: task.status === "completed" ? "pending" : "completed"
      };
    }

    return task;
  });

  saveTasks();
  renderTasks();
}
function editTask(taskId) {
  const taskToEdit = tasks.find(function (task) {
    return Number(task.id) === taskId;
  });

  if (!taskToEdit) {
    return;
  }

  editingTaskId = taskId;

  taskTitleInput.value = taskToEdit.title;
  taskSubjectInput.value = taskToEdit.subject;
  taskDueDateInput.value = taskToEdit.dueDate;
  taskPriorityInput.value = taskToEdit.priority;
  taskStatusInput.value = taskToEdit.status;

  formTitle.textContent = "Edit Teaching Task";
  saveTaskButton.textContent = "Update Task";

  taskFormSection.classList.remove("hidden");
  taskTitleInput.focus();
}
addTaskButton.addEventListener("click", openTaskForm);
closeFormButton.addEventListener("click", closeTaskForm);
taskForm.addEventListener("submit", createTask);
taskList.addEventListener("click", function (event) {
  const editButton = event.target.closest(".edit-button");
  const statusButton = event.target.closest(".status-button");
  const deleteButton = event.target.closest(".delete-button");

  if (editButton) {
    const taskId = Number(editButton.dataset.id);
    editTask(taskId);
    return;
  }

  if (statusButton) {
    const taskId = Number(statusButton.dataset.id);
    toggleTaskStatus(taskId);
    return;
  }

  if (deleteButton) {
    const taskId = Number(deleteButton.dataset.id);
    deleteTask(taskId);
  }
});
renderTasks();