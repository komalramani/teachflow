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
const taskSearchInput = document.querySelector("#task-search");

const statusFilter = document.querySelector("#status-filter");

const priorityFilter = document.querySelector("#priority-filter");

const clearFiltersButton = document.querySelector(

  "#clear-filters-button"

);
const sortTasksSelect = document.querySelector("#sort-tasks");
const overdueTasksElement =
  document.querySelector("#overdue-tasks");

const dueTodayTasksElement =
  document.querySelector("#due-today-tasks");
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

  const overdueTasks = tasks.filter(function (task) {
    return getDueStatus(task).label === "Overdue";
  }).length;

  const dueTodayTasks = tasks.filter(function (task) {
    return getDueStatus(task).label === "Due Today";
  }).length;

  totalTasksElement.textContent = tasks.length;
  pendingTasksElement.textContent = pendingTasks;
  completedTasksElement.textContent = completedTasks;
  overdueTasksElement.textContent = overdueTasks;
  dueTodayTasksElement.textContent = dueTodayTasks;
}

function formatText(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
function getDueStatus(task) {

  if (task.status === "completed") {

    return {

      label: "Completed",

      className: "due-completed"

    };

  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(`${task.dueDate}T00:00:00`);

  if (dueDate < today) {

    return {

      label: "Overdue",

      className: "due-overdue"

    };

  }

  if (dueDate.getTime() === today.getTime()) {

    return {

      label: "Due Today",

      className: "due-today"

    };

  }

  return {

    label: "Upcoming",

    className: "due-upcoming"

  };

}
function renderTasks() {

  taskList

    .querySelectorAll(".task-card")

    .forEach(function (taskCard) {

      taskCard.remove();

    });

  const searchText = taskSearchInput.value.trim().toLowerCase();

  const selectedStatus = statusFilter.value;

  const selectedPriority = priorityFilter.value;

  const filteredTasks = tasks.filter(function (task) {

    const matchesSearch =

      task.title.toLowerCase().includes(searchText) ||

      task.subject.toLowerCase().includes(searchText);

    const matchesStatus =

      selectedStatus === "all" ||

      task.status === selectedStatus;

    const matchesPriority =

      selectedPriority === "all" ||

      task.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesPriority;

  });
    const sortedTasks = [...filteredTasks];

const priorityOrder = {
    high: 3,
    medium: 2,
    low: 1
};

switch (sortTasksSelect.value) {
    case "due-ascending":
        sortedTasks.sort(function (taskA, taskB) {
            return new Date(taskA.dueDate) - new Date(taskB.dueDate);
        });
        break;

    case "due-descending":
        sortedTasks.sort(function (taskA, taskB) {
            return new Date(taskB.dueDate) - new Date(taskA.dueDate);
        });
        break;

    case "priority-high":
        sortedTasks.sort(function (taskA, taskB) {
            return priorityOrder[taskB.priority] - priorityOrder[taskA.priority];
        });
        break;

    case "priority-low":
        sortedTasks.sort(function (taskA, taskB) {
            return priorityOrder[taskA.priority] - priorityOrder[taskB.priority];
        });
        break;
}

  if (tasks.length === 0) {

    emptyMessage.textContent =

      "No tasks added yet. Click “Add Task” to begin.";

    emptyMessage.classList.remove("hidden");

  } else if (sortedTasks.length === 0) {

    emptyMessage.textContent =

      "No tasks match your search or selected filters.";

    emptyMessage.classList.remove("hidden");

  } else {

    emptyMessage.classList.add("hidden");

  }

  sortedTasks.forEach(function (task) {

    const taskCard = document.createElement("article");

    taskCard.className = "task-card";
    const dueStatus = getDueStatus(task);
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
      <span class="due-badge ${dueStatus.className}">

        ${dueStatus.label}

      </span>
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

          ${

            task.status === "completed"

              ? "Mark Pending"

              : "Mark Complete"

          }

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
taskSearchInput.addEventListener("input", renderTasks);

statusFilter.addEventListener("change", renderTasks);

priorityFilter.addEventListener("change", renderTasks);

clearFiltersButton.addEventListener("click", function () {
  taskSearchInput.value = "";
  statusFilter.value = "all";
  priorityFilter.value = "all";
  sortTasksSelect.value = "default";

  renderTasks();
});
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
sortTasksSelect.addEventListener("change", renderTasks);