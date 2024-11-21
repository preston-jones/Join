let tasks = [];
let prioTasks = [];

/**
 * This function loads several functions required on page load
 */
async function init() {
  await loadTemplates();
  await loadTasks();
  convertDueDates();
  loadPrioTasks();
  greetUser();
  renderMetricValues();
  setCurrentPageLinkActive("summary");
}

/**
 * This function loads all tasks objects from the
 * remote storage - using getItem function - and saves them to the tasks array
 */
async function loadTasks() {
  try {
    tasks = JSON.parse(await getItem("tasks"));
  } catch (e) {
    console.warn("no tasks found on server");
  }
}

/**
 * This function parses through the tasks array and converts the
 * dueDates from string to new Date() format
 */
function convertDueDates() {
  for (let i = 0; i < tasks.length; i++) {
    let taskDueDate = new Date(tasks[i]["date"]);
    tasks[i]["date"] = taskDueDate;
  }
}

/**
 * This function parses throuh the tasks array to return
 * the number of objects matching the criteria set by the parameters
 * @param {string} property - parameter to specify the objects property
 * @param {string} PropertyValue - parameter to specify the property value
 * @returns {number} the number of objects matching the criteria set by the parameters
 */
function returnNumberOfTasks(property, PropertyValue) {
  let x = 0;
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (task[property] == PropertyValue) x++;
  }
  return x;
}

/**
 * This function parses throuh the tasks array
 * @returns {number} - total number of objects
 */
function returnTotalTasks() {
  return tasks.length;
}

/**
 * This funtion parses through the tasks array
 * to push all objects with high priority to the prioTasks array
 */
function loadPrioTasks() {
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (task["prio"] == 1) prioTasks.push(task);
  }
}

/**
 * This function parses through the prioTasks array and
 * @returns {string} the next upcoming due date
 */
function returnNextDueDate() {
  const dueDate = new Date(Math.min(...prioTasks.map((e) => e.date)));

  if (!isNaN(dueDate)) {
    const dueDateString = dueDate.toLocaleString("default", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return dueDateString;
  } else {
    return "no deadline approaching";
  }
}

/**
 * This function calls the returnNumberOfTasks() function to fill
 * the innerHTML with the relevant metrics to be displayed
 */
function renderMetricValues() {
  document.getElementById("todo").innerHTML = returnNumberOfTasks(
    "taskStatus",
    0
  );
  document.getElementById("done").innerHTML = returnNumberOfTasks(
    "taskStatus",
    3
  );
  document.getElementById("priority").innerHTML = returnNumberOfTasks(
    "prio",
    1
  );
  document.getElementById("deadline").innerHTML = returnNextDueDate();
  document.getElementById("total-tasks").innerHTML = returnTotalTasks();
  document.getElementById("in-progress-tasks").innerHTML = returnNumberOfTasks(
    "taskStatus",
    1
  );
  document.getElementById("awaiting-feedback-tasks").innerHTML =
    returnNumberOfTasks("taskStatus", 2);
}

/**
 * This function greets the user based on the logged in user and time of the day
 */
function greetUser() {
  let now = new Date();
  let time = now.getHours();

  if (time <= 12)
    document.getElementById("greeting-message").innerHTML = "Good Morning,";
  if (time >= 12)
    document.getElementById("greeting-message").innerHTML = "Good Afternoon,";
  if (time >= 16)
    document.getElementById("greeting-message").innerHTML = "Good Evening,";

  document.getElementById("user-name").innerHTML = currentUser.charAt(0).toUpperCase() + currentUser.slice(1);
}
