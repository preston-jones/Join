const PRIO_URG = 1;
const PRIO_MDM = 2;
const PRIO_LOW = 3;
const TASK_STATUS_TODO = 0;
const TASK_STATUS_INPROGRESS = 1;
const TASK_STATUS_AWAITFEEDBACK = 2;
const TASK_STATUS_DONE = 3;

let taskPrio = PRIO_MDM;
let tasks = [];
let storedTasks = [];
let category = [];

const taskStatusCategories = ["To do", "In progress", "Await feedback", "Done"];

const categories = [
    {
        name: 'Development',
        colour: '#462F8A',
    },
    {
        name: 'Design',
        colour: '#FF7A00',
    },
    {
        name: 'Project and Task Management',
        colour: '#1FD7C1',
    },
    {
        name: 'Collaboration and Communication',
        colour: '#0038FF',
    },
    {
        name: 'Management',
        colour: '#9C27B0',
    },
];

/**
 * Initializes the add task functionality.
 * Loads templates, contacts, sets current page link active, and renders the add task form.
 * @returns {Promise<void>} A promise that resolves when the initialization is complete.
 */
async function addTaskInit() {
    await loadTemplates();
    await loadContacts();
    setCurrentPageLinkActive("add_task");
    renderAddTaskForm('add-task-placeholder');
}

/**
 * Submits a task with the given task status and optional task ID.
 * @param {string} taskStatus - The status of the task.
 * @param {number} [submitTaskID=0] - The ID of the task to be submitted (optional).
 * @returns {Promise<void>} - A promise that resolves when the task is submitted.
 */
async function submitTask(taskStatus, submitTaskID = 0) {
    let title = document.getElementById('task-title').value;
    let description = document.getElementById('task-description').value;
    let date = new Date(document.getElementById('task-date').value);
    let task = {
        'title': title,
        'description': description,
        'date': date,
        'prio': taskPrio,
        'assignedUsers': assignUserList,
        'category': category,
        'taskStatus': taskStatus,
        'taskID': new Date().getTime(),
        'subtasks': subtasks,
    };
    tasks = await getRemote('tasks');
    if(submitTaskID){
        const index = tasks.findIndex((task) => task.taskID === submitTaskID);
        task.taskID = submitTaskID;
        tasks[index] = task;
    } else tasks.push(task);
    await setItem('tasks', tasks);
    showAddedTaskMsg();
    if(!submitTaskID){
        setTimeout(() => {
           window.location.href = `./board.html`;
        }, 1400);
    }
}

/**
 * Shows a message indicating that a task has been added.
 */
function showAddedTaskMsg() {
    document.getElementById("task-added").classList.remove("d-none");
    setTimeout(() => {
      const taskAdded = document.getElementById("task-added");
      if (taskAdded) {
       taskAdded.classList.add("d-none");
      }
    }, 900);
  }

/**
 * Updates the priority button based on the pressed state.
 * @param {boolean} pressed - The state of the button (true if pressed, false otherwise).
 * @param {string} btn - The ID of the button element.
 */
function prioButtonUpdate(pressed, btn) {
        if(pressed){
            document.getElementById(btn).classList.add('d-none');
            document.getElementById(btn + '-clicked').classList.remove('d-none');
        } else {
            document.getElementById(btn).classList.remove('d-none');
            document.getElementById(btn + '-clicked').classList.add('d-none');
        }
}

/**
 * Sets the task priority to urgent and updates the priority buttons accordingly.
 */
function prioButtonUrgent(){
    taskPrio = PRIO_URG;
    prioButtonUpdate(true, 'urgent-btn');
    prioButtonUpdate(false, 'medium-btn');
    prioButtonUpdate(false, 'low-btn');
}

/**
 * Sets the task priority to medium and updates the priority buttons accordingly.
 */
function prioButtonMedium(){
    taskPrio = PRIO_MDM;
    prioButtonUpdate(false, 'urgent-btn');
    prioButtonUpdate(true, 'medium-btn');
    prioButtonUpdate(false, 'low-btn');
}

/**
 * Sets the task priority to low and updates the priority buttons accordingly.
 */
function prioButtonLow(){
    taskPrio = PRIO_LOW;
    prioButtonUpdate(false, 'urgent-btn');
    prioButtonUpdate(false, 'medium-btn');
    prioButtonUpdate(true, 'low-btn');
}

/**
 * Disables the default behavior of a button.
 * @param {string} button - The ID of the button to disable.
 */
function disableBtnsDefault(button){
    document.getElementById(button).addEventListener('click', function(event) {
        event.preventDefault();
    });
}

/**
 * Disables the default behavior of buttons.
 */
function disablePrioBtns(){
    disableBtnsDefault('urgent-btn');
    disableBtnsDefault('medium-btn');
    disableBtnsDefault('low-btn');
    disableBtnsDefault('urgent-btn-clicked');
    disableBtnsDefault('medium-btn-clicked');
    disableBtnsDefault('low-btn-clicked');
    disableBtnsDefault('user-select-button');
    disableBtnsDefault('categories-select-button');
}

/**
 * Renders a category list item with the given name, colour, and index.
 * 
 * @param {string} name - The name of the category.
 * @param {string} colour - The colour of the category.
 * @param {number} index - The index of the category.
 * @returns {string} The HTML representation of the category list item.
 */
function renderCategoriesList(name, colour, index) {
    return /*html*/`
            <div class="dropdown-position" onclick="selectOptionCat(this, ${index})" id="category-${name}">
                <div class="initials-name" value="${index}" name="${name}">
                ${name}
                </div>
                <div class="acc-initials categories-colour" style="background-color: ${colour}">
                </div>
            </div>
        `;
    }

/**
 * Toggles the visibility of the categories select dropdown and renders the categories list.
 */
function toggleCategoriesSelect() {
    let categoriesList = document.getElementById('categories-list');
    categoriesList.innerHTML = '';
    for (let index = 0; index < categories.length; index++) {
        let name = categories[index]['name'];
        let colour = categories[index]['colour'];
        categoriesList.innerHTML += renderCategoriesList(name, colour, index);
    }   
    const dropdown = document.getElementById('categories-list');
    const dropdownIcon = document.getElementById('dropdown-icon-categories');
    dropdownIcon.classList.toggle("rotate");
    dropdown.classList.toggle("d-none-ni");
}

/**
 * Retrieves the task category list.
 * @returns {Promise<Array>} The task category list.
 */
 async function getTaskCategorieList() {
    return categories;
 }

/**
 * Handles category selection in the categories dropdown and updates the category value.
 * @param {HTMLElement} element - The element representing the selected option.
 * @param {number} index - The index of the selected option in the dropdown.
 * @returns {Promise<void>} - A promise that resolves when the selected category is retrieved.
 */
async function selectOptionCat(element, index) {
    const selectedCategoryInput = document.getElementById('selected-category');
    const selectedEntry = element.querySelector('.initials-name').getAttribute('name');

    selectedCategoryInput.value = selectedEntry;
    toggleCategoriesSelect();
    const selectedCategory = await getTaskCategorieList();
    
    category = selectedCategory[index];
}

/**
 * Callback for closing dropdown on click outside
*/
document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('categories-list');
    const dropdownContainer = document.getElementById('categories-select-button');
    const dropdownIcon = document.getElementById('dropdown-icon-categories');

    if(dropdownContainer){
        if (!dropdownContainer.contains(event.target)) {
            dropdown.classList.add('d-none-ni');
            dropdownIcon.classList.remove('rotate');
        }
    }
});


/**
 * Generates a unique ID based on the current timestamp.
 * @returns {number} The generated unique ID.
 */
function generateUniqueID() {
    const timestamp = new Date().getTime();
    return timestamp;
}

/**
 * Resets the value of a subtask input field.
 * @param {HTMLInputElement} subtaskInput - The input field to be reset.
 */
function resetSubtaskInput(subtaskInput) {
    subtaskInput.value = '';
}

/**
 * Retrieves the task status by index.
 * @param {number} idx - The index of the task status.
 * @returns {string} The task status.
 */
function getTaskStatusByIndex(idx){
    return taskStatusCategories[idx];
}

/**
 * Retrieves a task by its ID.
 * @param {string} id - The ID of the task.
 * @returns {Object} - The task object matching the provided ID.
 */
async function getTaskById(id){
    tasks = await getRemote('tasks');
    const index = tasks.findIndex((task) => task.taskID === id);
    return tasks[index];
}

/**
 * Deletes a task with the specified ID.
 * @param {string} id - The ID of the task to be deleted.
 * @returns {Promise<void>} - A promise that resolves when the task is deleted.
 */
async function deleteTask(id) {
    tasks = await getRemote('tasks');
    const index = tasks.findIndex((task) => task.taskID === id);
    if (index !== -1) {
        tasks.splice(index, 1);
    }
    await setItem('tasks', tasks);
    window.location.href = `./board.html`;
}

/**
 * Clears the task form by removing assigned users and subtasks.
 */
function taskFormClear(){
    assignUserList.forEach(user => {
        const selectedIcon = document.getElementById('selected-icon-user-assigned-' + user.id.toString());
        if (selectedIcon) {
            selectedIcon.remove();
        }
    });
    prioButtonMedium();
    assignUserList = [];
    subtasks = [];
    document.getElementById('select-subtask').innerHTML = '';
}
