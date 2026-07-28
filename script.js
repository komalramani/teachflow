const addTaskButton = document.querySelector("#add-task-button");
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

addTaskButton.addEventListener("click", function () {
  const taskFormSection = document.querySelector("#task-form-section");
const taskForm = document.querySelector("#task-form");
const closeFormButton = document.querySelector("#close-form-button");

addTaskButton.addEventListener("click", function () {
  taskFormSection.classList.remove("hidden");
});

closeFormButton.addEventListener("click", function () {
  taskFormSection.classList.add("hidden");
  taskForm.reset();
});
});

updateDashboard();