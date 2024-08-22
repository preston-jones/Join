let allTasksFromStorage = [];   /** Array of all the task objects from the server */
let currentDraggedElementID;    /** Variable contains the ID of the current dragged element */
let currentDraggedElementINDEX; /** Variable contains the Index position of the current dragged task object in the allTasksFromStorage[] array */


let toDo;           /** Array contains all the task objects with the value 'taskStatus': 0 */
let inProgress;     /** Array contains all the task objects with the value 'taskStatus': 1 */
let awaitFeedback;  /** Array contains all the task objects with the value 'taskStatus': 2 */
let done;           /** Array contains all the task objects with the value 'taskStatus': 3 */


/**
 * This asynchronous function loads required functions for the board.html page to load.
 */
async function init() {
    await loadTemplates();
    setCurrentPageLinkActive('board');
    await getTasks();
    loadBoard();
}


/**
 * Function to load the board columns with the attached task objects on the board.html.
 */
function loadBoard() {
    renderToDo();
    renderInProgress();
    renderAwaitFeedback();
    renderDone();
}


/** This asynchronous function loads all the task objects from the server into a local array, after formated into JSON format.
*/
async function getTasks() {
    allTasksFromStorage = JSON.parse(await getItem("tasks"));
}


/**
 * This function loads all the filtered task objects from the allTasksFromStorage[] array, related to the value of the "find task" inputfield.
 */
function loadSearchResult() {
    renderToDo();
    renderInProgress();
    renderAwaitFeedback();
    renderDone();
}


/**
 * This unction renders all filtered task objects with the value 'taskStatus': 0 from the allTasksFromStorage[] array into the "To Do" column.
 */
function renderToDo() {
    document.getElementById('column_todo').innerHTML = '';
    toDo = allTasksFromStorage.filter(t => t['taskStatus'] == 0);

    if (toDo.length == 0) {
        renderNoTaskToDo('column_todo');
    }
    else {
        for (let index = 0; index < toDo.length; index++) {
            const element = toDo[index];
            renderThumbnailCard('column_todo', index, element)
        }
    }
}


/**
 * Function to render all filtered task objects with the value 'taskStatus': 1 from the allTasksFromStorage[] array into the "In progresso" column.
*/
function renderInProgress() {
    document.getElementById('column_in_progress').innerHTML = '';
    inProgress = allTasksFromStorage.filter(t => t['taskStatus'] == 1);

    if (inProgress.length == 0) {
        renderNoTaskToDo('column_in_progress');
    }
    else {
        for (let index = 0; index < inProgress.length; index++) {
            const element = inProgress[index];
            renderThumbnailCard('column_in_progress', index, element)
        }
    }
}


/**
 * Function to render all filtered task objects with the value 'taskStatus': 2 from the allTasksFromStorage[] array into the "Await feedback" column.
*/
function renderAwaitFeedback() {
    document.getElementById('column_await_feedback').innerHTML = '';
    awaitFeedback = allTasksFromStorage.filter(t => t['taskStatus'] == 2);

    if (awaitFeedback.length == 0) {
        renderNoTaskToDo('column_await_feedback');
    }
    else {
        for (let index = 0; index < awaitFeedback.length; index++) {
            const element = awaitFeedback[index];
            renderThumbnailCard('column_await_feedback', index, element)
        }
    }
}


/**
 * Function to render all filtered task objects with the value 'taskStatus': 3 from the allTasksFromStorage[] array into the "Done" column.
*/
function renderDone() {
    document.getElementById('column_done').innerHTML = '';
    done = allTasksFromStorage.filter(t => t['taskStatus'] == 3);

    if (done.length == 0) {
        renderNoTaskDone('column_done');
    }
    else {
        for (let index = 0; index < done.length; index++) {
            const element = done[index];
            renderThumbnailCard('column_done', index, element)
        }
    }
}


/**
 * This asynchronous function compares the input value of the inputfield on the board page and filters all task objects from the allTasksFromStorage[] array
 * which includes the inputfield value in their title and/or the description.
 * The result is loaded in an array named filteredTasks which is then loaded back into the allTasksFromStorage[] array.
*/
async function searchTask() {
    await getTasks();
    inputSearchfield = document.getElementById('inputfield_find_task').value.toLowerCase();
    let filteredTasks = allTasksFromStorage.filter(task => task['title'].toLowerCase().includes(inputSearchfield));
    filteredTasks = allTasksFromStorage.filter(task => task['description'].toLowerCase().includes(inputSearchfield));
    allTasksFromStorage = filteredTasks;
    loadBoard();
}


/* --- Drag and Drop --- */
/**
 * This function loads the preventDefault() method when a element is dragged over a dragable area which cancels the event if it is cancelable, meaning that the default action that belongs to the event will not occur.
 * @param {*} ev 
 */
function allowDrop(ev) {
    ev.preventDefault();
}


/**
 * When an Html element is dragged this function adds a class to it, to rotate the element about 5 degrees clockwise.
 * It then saves the taskID and the index of the task object in the allTasksFromStorage[] array.
 * @param {number} index - Position of the task object in the array allTasksFromStorage[].
 * @param {string} element_taskID - TaskID of the current task object.
 */
function startDragging(index, element_taskID) {
    document.getElementById(element_taskID).classList.add('rotare_thumpnail');
    currentDraggedElementID = element_taskID;
    currentDraggedElementINDEX = index;
}


/**
 * The function changes the taskStatus value of the current task object after it is dropped.
 * @param {number} task_status - The status value of the task object.
 */
function moveTo(task_status) {
    event.stopPropagation();
    let currentDraggedElement = allTasksFromStorage.filter(t => t['taskID'] == currentDraggedElementID);
    currentDraggedElement[0]['taskStatus'] = task_status;
    setItem('tasks', allTasksFromStorage);
    loadBoard();
}


/**
 * Function to add the class "drag_area_highlight" to a Html element by ID.
 * @param {string} id - ID of the Html element to which the class is added.
 */
function highlight(id) {
    document.getElementById(id).classList.add('drag_area_highlight');
}


/**
 * Function to remove the class "drag_area_highlight" to a Html element by ID.
 * @param {string} id - ID of the Html element from which the class is removed.
 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}


/**
 * This function loads the Html template for the notifacation "No Task To Do" in an empty column of category.
 * @param {string} category - ID of the column of category.
 */
function renderNoTaskToDo(category) {
    document.getElementById(category).innerHTML += noTaskToDoHTML();
}


/**
 * This function loads the Html template for the notifacation "No Task Done" in the empty column of the category "Done".
 * @param {string} category - ID of the column "Done".
 */
function renderNoTaskDone(category) {
    document.getElementById(category).innerHTML += noTaskDoneHTML();
}


/* --- Task Cards --- */

/**
 * This function opens the submenu of a thumbnail card by adding the class "show_task_card_thumbnail_submenu" to the Html element related to the current selected task object.
 * @param {string} taskID - ID of the current selected task object.
 * @param {number} taskStatus - the taskStatus value of the current selected task object.
 */
function openThumbnailSubmenu(taskID, taskStatus) {
    event.stopPropagation();
    document.getElementById(`task_card_thumbnail_submenu_${taskID}`).classList.add('show_task_card_thumbnail_submenu');
    loadMoveTo(taskID, taskStatus);
}


/**
 * This function closes the submenu of a thumbnail card by removing the class "show_task_card_thumbnail_submenu" to the Html element related to the current selected task object.
 * It then empties the Html element in which the submenu links were loaded.
 * @param {string} taskID - ID of the current selected task object.
 * @param {number} taskStatus - the taskStatus value of the current selected task object.
 */
function closeThumbnailSubmenu(taskID, taskStatus) {
    event.stopPropagation();
    document.getElementById(`task_card_thumbnail_submenu_${taskID}`).classList.remove('show_task_card_thumbnail_submenu');
    document.getElementById(`task_card_thumbnail_submenu_link_container_${taskID}`).innerHTML = '';
}


/**
 * This function loads the "Move To" category links to the submenu of the thumbnail, of the current selected task object.
 * @param {string} taskID - ID of the current selected task object.
 * @param {number} taskStatus - the taskStatus value of the current selected task object.
 */
function loadMoveTo(taskID, taskStatus) {
    let taskStatusArray = [
        {'name': 'To Do', 'taskStatus': 0},
        {'name': 'In Progress', 'taskStatus': 1},
        {'name': 'Await Feedback', 'taskStatus': 2},
        {'name': 'Done', 'taskStatus': 3}
    ];
    for (let index = 0; index < taskStatusArray.length; index++) {
        if (taskStatusArray[index].taskStatus!==taskStatus) {
            currentDraggedElementID = taskID;
            document.getElementById(`task_card_thumbnail_submenu_link_container_${taskID}`).innerHTML += `<div class="task_card_thumbnail_submenu_link" onclick="moveTo(${taskStatusArray[index].taskStatus})">&#8226 ${taskStatusArray[index].name}</div>`;
        }
    }
}


/**
 * Function to render the Html template of the thumbnail card of the current selected task object containing previewed data of the task object.
 * @param {number} category - ID of the category column in which the Html template should be rendered.
 * @param {number} index - Position of the current selected task object in the array allTasksFromStorage[].
 * @param {object} element - The current selected task object.
 */
function renderThumbnailCard(category, index, element) {
    document.getElementById(category).innerHTML += thumbnailCard_HTML(index, element);
    renderAssignedUsers(element);
    loadNoSubtasksInThumbnail(element);
}


/**
 * Function to load the Html template of the task card of the current selected task object containing all data of the task object.
 * @param {string} elementByID - The ID of the Html element in which the task card template, containing all data of the current selected task object, should be loaded.
 * @param {string} cardID - The ID of the current selected task object.
 */
function openTaskCard(elementByID, cardID) {
    renderTaskCardBoard(elementByID, cardID);
    document.getElementById('task-card-bgr-container').classList.add('show-task-card');
}


/**
 * Function to close the previous rendered task card template by removing the class "show-task-card" from the current selected Html element.
 */
function closeTaskCard() {
    document.getElementById('task-card-bgr-container').classList.remove('show-task-card');
    loadBoard();
}


/**
 * This function renders the Html template of the task card of the current selected task object containing all data of the task object.
 * @param {string} elementId - The ID of the Html element containing the current selected task object.
 * @param {string} cardID - The ID of the current selected task object.
 */
async function renderTaskCardBoard(elementId, cardID) {
    await getTasks();
    task = allTasksFromStorage.filter(t => t['taskID'] == cardID)[0];
    let taskCard = document.getElementById(elementId);
    taskCard.innerHTML = taskCardBoard_HTML(task, elementId);
}


/**
 * This function renders all the assigned users of the current selected task object into the task card template.
 * @param {object} element - The current selected task object.
 * @returns - If a curtain number of assigned users is rendered, it returns a Html template, containing the remaining assigned users as a summarized number.
 */
function renderAssignedUsers(element) {
    for (let i = 0; i < element.assignedUsers.length; i++) {
        if (i >= 3) {
            let moreUsers = element.assignedUsers.length - i;
            return document.getElementById(`task_card_thumbnail_assigned_users_container_${element.taskID}`).innerHTML += `
            <div class="acc-initials task_card_thumbnail_profile_badge_frame more_users">+${moreUsers}</div>`;
        }
        else {
            document.getElementById(`task_card_thumbnail_assigned_users_container_${ element.taskID }`).innerHTML += `
            <div class="acc-initials task_card_thumbnail_profile_badge_frame" style = "background: ${element.assignedUsers[i].bgColor};"> ${ returnInitials(element.assignedUsers[i].name) }</div> `;
        }
    }
}


/* --- Subtasks --- */

/**
 * This function loads all the subtasks of the current selected task object in the Html task card.
 * @param {string} taskID - The ID of the current selected task object.
 * @param {Array} subtasks - An array containing all the subtasks of the task object.
 * @returns It returns the subtasks of the task object. If there are no subtasks in the task object it returns a string "No Subtasks".
 */
function loadSubtasksInCard(taskID, subtasks) {
    if (subtasks.length == 0) {
        return `No Subtasks`;
    }
    else {
        return renderSubtasks(taskID, subtasks);
    }
}


/**
 * This function loads all the subtasks of the current selected task object in the Html thumbnail card.
 * @param {object} element - The current selected task object containing all task data.
 */
function loadNoSubtasksInThumbnail(element) {
    if (element.subtasks.length == 0) {
        document.getElementById(`task_card_thumbnail_progress_${ element.taskID }`).innerHTML = `<div class="no_subtasks">No Subtasks</div>`;
    }
}


/**
 * This function renders the progressbar in the thumbnail card. It is related to the number of checked
 * @param {Array} subtasks - An array containing all the subtasks of the task object.
 * @returns Returns the rounded number of all checked subtasks related to the total amount of subtasks as percentage. The number is used to set the width of the progressbar.
 */
function renderSubtaskProgressBar(subtasks) {
    let NumberOfSubtasks = subtasks.length;
    let SubtasksDone = subtasks.filter(t => t['2'] == true);
    return Math.round((100 / NumberOfSubtasks) * SubtasksDone.length);
}


/**
 * This function filters all subtasks with the status "done" in an extra array.
 * @param {Array} subtasks - An array containing all the subtasks of the task object.
 * @returns Returns the length of an array containing all subtasks with the status "done" of the current selected task object
 */
function SubtasksDone(subtasks) {
    let SubtasksDone = subtasks.filter(t => t['2'] == true);
    return SubtasksDone.length;
}


/* --- Task Form / Edit & Add --- */

/**
 * This function loads the Html task form to editing an existing task object.
 * @param {string} elementId - The ID of the Html element in which the task form is loaded into.
 * @param {string} taskID - ID of the current selected task object.
 */
async function loadEditTaskForm(elementId, taskID) {
    await renderEditTaskForm(elementId, taskID);
    overwriteAddTaskFormCSS();
}


/**
 * This function overwrites the css rules of the "add task" form
 */
function overwriteAddTaskFormCSS() {
    document.getElementById('task-card').classList.add('task_card_container_overwrite');
    document.getElementById('add-task-form-container').classList.add('add_task_form_overwrite', 'task_card_container::-webkit-scrollbar', 'hide_scrollbar', 'add-task-form-overwrite');
    document.getElementById('content-add-task').classList.add('content_add_task_overwrite');
    document.getElementById('borderline').classList.add('borderline_overwrite');
    document.getElementById('add_task_popup_close_button').classList.add('d-none');
}


/**
 * This function loads the Html container containing the "add task" form.
 * @param {number} taskstatus - Status value of the new added task. By default the value is set to 0 (= to do).
 */
function openAddTaskPopup(taskstatus) {
    renderAddTaskForm('add-task-placeholder', taskstatus);
    document.getElementById('add_task_popup_container').classList.add('show_add_task_popup');
    document.getElementById('edit_task_popup_close_button').classList.add('d-none');
}


/**
 * This function closes the Html container containing the "add task" form.
 */
function closeAddTaskPopup() {
    document.getElementById('add-task-placeholder').innerHTML = '';
    document.getElementById('add_task_popup_container').classList.remove('show_add_task_popup');
}