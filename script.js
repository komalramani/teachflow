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
  alert("The task form will be added in the next step.");
});

updateDashboard();