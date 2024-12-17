/**
 * Selects or deselects a subtask status based on the checkbox state.
 * @param {HTMLInputElement} checkbox - The checkbox element representing the subtask status.
 * @param {string} taskID - The ID of the task containing the subtask.
 * @param {string} subtaskID - The ID of the subtask.
 * @returns {Promise<void>} - A promise that resolves once the subtask status is updated.
 */
async function selectSubtaskStatus(checkbox, taskID, subtaskID){
    let tasks = await getRemote('tasks');
    const taskIdx = tasks.findIndex((task) => task.taskID === taskID);
    const subtaskIdx = tasks[taskIdx].subtasks.findIndex((subtask) => subtask[SUBTASK_ID] === subtaskID);
    if (subtaskIdx !== -1) {
        if (checkbox.checked) {
            tasks[taskIdx].subtasks[subtaskIdx][SUBTASK_DONE] = true;
        } else {
            tasks[taskIdx].subtasks[subtaskIdx][SUBTASK_DONE] = false;
        }
        await setItem('tasks', tasks);
        await getTasks();
        loadBoard();
    } else {
        console.warn('subtask not found in tasks[' + taskIdx + ']');
    }
}

/**
 * Renders a subtask element.
 * 
 * @param {number} taskID - The ID of the parent task.
 * @param {object} subtask - The subtask object.
 * @returns {string} The HTML representation of the subtask element.
 */
 function renderSubtask(taskID, subtask){
    const checked = subtask[SUBTASK_DONE] ? "checked" : "";
    return /*html*/`
    <div>
        <input type="checkbox" role="option" class="subtask-entry-task" id="selected-subtask-${subtask[SUBTASK_ID]}" ${checked}
        onclick="selectSubtaskStatus(this, ${taskID}, ${subtask[SUBTASK_ID]})"/>
        ${subtask[SUBTASK_TEXT]}
    </div>  
        `;
}

/**
 * Renders the subtasks for a given task.
 * 
 * @param {string} taskID - The ID of the task.
 * @param {Array} subtasks - An array of subtasks.
 * @returns {string} - The HTML representation of the subtasks.
 */
function renderSubtasks(taskID, subtasks){
    let html = "";
    subtasks.forEach(subtask => { 
        html += renderSubtask(taskID, subtask);
    });
    return html;
}

/**
 * Renders the assigned user icons.
 * 
 * @param {Array} assignedUserList - The list of assigned users.
 * @returns {string} The HTML representation of the assigned user icons.
 */
function renderAssignedUserIcons(assignedUserList){
    let html = "";
    assignedUserList.forEach(user => {
        html += renderUserIconDropdown(user);
    });
    return html;
}

/**
 * Renders the priority of a task.
 * 
 * @param {string} prio - The priority of the task.
 * @param {boolean} renderName - Indicates whether to render the priority name.
 * @returns {string} The HTML representation of the priority.
 */
function renderPriority(prio, renderName){
    let html = "";
    switch(prio){
        case PRIO_URG: {
            if(renderName) {
                html += /*html*/ `<span>Urgent</span>`;
            } 
            html += /*html*/ `<img class="prio-icon" src="/assets/img/icons/Prio alta.svg" alt="">`;
            break;
        }
        case PRIO_MDM: {
            if(renderName) {
                html += /*html*/ `<span>Medium</span>`;
            }
            html += /*html*/ `<img class="prio-icon" src="/assets/img/icons/Prio media.svg" alt="">`;
            break;
        }
        case PRIO_LOW: {
            if(renderName) {
                html += /*html*/ `<span>Low</span>`;
            }
            html += /*html*/ `<img class="prio-icon" src="/assets/img/icons/Prio baja.svg" alt="">`;
            break;
        }
    }
    return html;
}

// return date in format dd/mm/yyyy
/**
 * Converts a given date to a normal date format (dd/mm/yy).
 *
 * @param {Date} date - The date to be converted.
 * @returns {string} The date in the format dd/mm/yy.
 */
function normalDate(date) {
    let d = new Date(date);
    let day = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear() % 100;
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;

    return `${day}/${month}/${year}`;
}

/**
 * Converts a date string to a formatted date string in the format "YYYY-MM-DD".
 * @param {Date} date - The date to be converted.
 * @returns {string} The formatted date string.
 */
function normalDateEditTask(date) {
    let d = new Date(date);
    let day = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();

    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;

    return `${year}-${month}-${day}`;
}

/**
 * Renders the add task form in the specified element.
 * @param {string} elementId - The ID of the element where the form will be rendered.
 * @param {string} [setTaskStatus=TASK_STATUS_TODO] - The status of the task to be set by default.
 */
function renderAddTaskForm(elementId, setTaskStatus = TASK_STATUS_TODO) {
    let addTaskForm = document.getElementById(elementId);
    addTaskForm.innerHTML = '';
    const date = new Date().getTime();
    addTaskForm.innerHTML = renderTaskForm(
                                'Add Task',                     //  formTitle
                                '',                             //  title
                                '',                             //  description
                                date,                           //  date
                                undefined,                      //  prio
                                undefined,                      //  assignedUsers
                                undefined,                      //  categorySubmit
                                taskStatus = setTaskStatus,     //  taskStatus
                                undefined,                      //  taskID
                                undefined,                      //  subtasksSubmit
                                undefined,                      //  elementId
                                );
    disablePrioBtns();
}

/**
 * Renders the edit task form with the provided task details.
 * 
 * @param {string} elementId - The ID of the HTML element where the form will be rendered.
 * @param {string} taskId - The ID of the task to be edited.
 * @returns {Promise<void>} - A promise that resolves when the form is rendered.
 */
async function renderEditTaskForm(elementId, taskId) {
    let task = await getTaskById(taskId);
    let addTaskForm = document.getElementById(elementId);

    assignUserList = task['assignedUsers'];
    addTaskForm.innerHTML = '';
    addTaskForm.innerHTML = renderTaskForm(
                                'Edit Task',                        //  formTitle
                                task['title'],                      //  title
                                task['description'],                //  description
                                task['date'],                       //  date
                                task['prio'],                       //  prio
                                task['assignedUsers'],              //  assignedUsers
                                task['category'],                   //  categorySubmit
                                taskStatus = task['taskStatus'],    //  taskStatus
                                task['taskID'],                     //  taskID
                                task['subtasks'],                   //  subtasksSubmit
                                elementId                           //  elementId   
                                );
    document.getElementById('reset').classList.add('d-none');
    document.getElementById('selected-category').value = task['category']['name'];
    assignUserList.forEach(user => {    
        renderTaskUserIcon(user.id, user.bgColor, user.name);
    });
    switch(task['prio']){
        case PRIO_URG: {
            prioButtonUrgent();
            break;
        } 
        case PRIO_MDM: {
            prioButtonMedium();
            break;
        }
        case PRIO_LOW: {
            prioButtonLow();
            break;
        }
    }
    subtasks = task['subtasks'];
    subtasks.forEach(subtask => {
        const selectSubtaskList = document.getElementById('select-subtask');
        selectSubtaskList.innerHTML += renderSubtaskListItem(subtask[SUBTASK_TEXT] , subtask[SUBTASK_ID]);
    });
    disablePrioBtns();
}

/**
 * Renders a task form with the specified parameters.
 *
 * @param {string} formTitle - The title of the form.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {number} date - The due date of the task in milliseconds.
 * @param {string} prio - The priority of the task.
 * @param {Array} assignedUsers - The list of users assigned to the task.
 * @param {Array} categorySubmit - The category for the task.
 * @param {string} taskStatus - The status of the task.
 * @param {number} taskID - The ID of the task.
 * @param {Array} subtasksSubmit - The list of subtasks for the task.
 * @param {string} elementId - The ID of the HTML element where the form will be rendered.
 * @returns {string} The HTML code for the task form.
 */
function renderTaskForm(
                formTitle = 'Untitled', 
                title = '',
                description = '',
                date = new Date().getTime(),
                prio = PRIO_MDM,
                assignedUsers = [],
                categorySubmit = [],
                taskStatus = TASK_STATUS_TODO,
                taskID = 0,
                subtasksSubmit = [],
                elementId = 'board_popup_placeholder',
                ) {

    let submitBtnName = !taskID ? 'Create Task' : 'Submit Changes';
    let popUpMsg = !taskID ? 'Task created ' : 'Task updated ';
    let taskTitle = title.length ? `value="${title}"` : '';
    let taskDescription = description.length ? `${description}` : '';
    let taskDate = date !== 0 ? `value="${normalDateEditTask(date)}"` : '';
    category = categorySubmit;
    return /*html*/ `
    <form class="add-task-form" id="add-task-form-container" action="board.html" method="get"
        onsubmit="event.preventDefault(); submitTask(${taskStatus}, submitTaskID = ${taskID}); setTimeout(() => renderTaskCardBoard('${elementId}', ${taskID}), 2000);" autocomplete="off">
        <div class="task-form-full">
        <div class="header-div">
            <h1>${formTitle}</h1>
            <div class="add_task_popup_close_button" id="add_task_popup_close_button" onclick="closeAddTaskPopup()">
                <img src="assets/img/icons/cancel.svg">
            </div>
            <div class="add_task_popup_close_button" id="edit_task_popup_close_button" onclick="openTaskCard('task-card', ${taskID})">
                <img src="assets/img/icons/cancel.svg">
            </div>
        </div>
        <div class="content-add-task" id="content-add-task">
            <div class="title-description-div">
                <div class="task-categories title">
                    <div class="required">
                        <span>Title</span><span class="red-asterisk">*</span>
                    </div>
                    <div class="input-container">
                        <input type="text" ${taskTitle} id="task-title" required class="input-field" placeholder="Enter a title">
                    </div>
                </div>
                <div class="task-categories description">
                    <div class="required">
                        <span>Description</span><span class="red-asterisk">*</span>
                    </div>
                    <div class="input-container">
                        <textarea type="text" text="ewewr" id="task-description" 
                        class="input-field" placeholder="Enter a Description">${taskDescription}</textarea>
                    </div>
                </div>
                <div class="task-categories users">
                    <span>Assigned to</span>
                    <div class="custom-select" id="select-users">
                        <button class="dropdown select-button" role="combobox"
                            onclick="filterUsers();" id="user-select-button">
                            <input placeholder="Select contacts to assign" type="text" autocomplete="off"
                                class="selected-value" id="search" onclick="filterUsers(); toggleInputUsers()" onchange="filterUsers()">
                            <img class="dropdown-icon" id="dropdown-icon-users"
                                src="/assets/img/icons/arrow_drop_downaa.svg" alt="dropdown icon" onclick="toggleCustomSelect()">
                        </button>
                        <div>
                            <span id="list"></span>
                        </div>
                        <ul class="dropdown d-none-ni" role="listbox" id="select-dropdown-users">
                        </ul>
                    </div>
                    <div class="selected-users-container" id="selected-users-container">
                    </div>
                </div>
            </div>
            <div class="borderline" id="borderline"></div>
            <div class="date-prio-container">
                    <div class="task-categories date">
                        <div class="required">
                            <span>Due date</span><span class="red-asterisk">*</span>
                        </div>
                        <input type="date" id="task-date" class="input-field date-task-inputfield" ${taskDate} placeholder="dd/mm/yy">
                    </div>
                    <div class="task-categories prio-categories">
                        <span>Prio</span>
                        <div class="prio-btn-container">
                            <button onclick="prioButtonUrgent()" class="prio urgent-btn" id="urgent-btn">
                                <span>Urgent</span>
                                <img class="prio-icon" src="/assets/img/icons/Prio alta.svg" alt="">
                            </button>
                            <button type="button" value="urgent" class="prio urgent-btn-clicked d-none"
                                id="urgent-btn-clicked">
                                <span>Urgent</span>
                                <img class="prio-icon" src="/assets/img/icons/Prio alta-white.svg" alt="">
                            </button>
                            <button onclick="prioButtonMedium()" class="prio medium-btn d-none" id="medium-btn">
                                <span>Medium</span>
                                <img class="prio-icon" src="/assets/img/icons/Prio media.svg" alt="Medium Prio Icon">
                            </button>
                            <button type="button" value="medium" class="prio medium-btn-clicked"
                                id="medium-btn-clicked">
                                <span>Medium</span>
                                <img class="prio-icon" src="assets/img/icons/Prio media-white.svg"
                                    alt="Medium Prio Icon">
                            </button>
                            <button onclick="prioButtonLow()" class="prio low-btn" id="low-btn">
                                <span>Low</span>
                                <img class="prio-icon" src="/assets/img/icons/Prio baja.svg" alt="Low Prio Icon">
                            </button>
                            <button type="button" value="low" class="prio low-btn-clicked d-none" id="low-btn-clicked">
                                <span>Low</span>
                                <img class="prio-icon" src="/assets/img/icons/Prio baja-white.svg" alt="Low Prio Icon">
                            </button>
                        </div>
                    </div>
                    <div class="task-categories categories-input">
                        <div class="required">
                            <span>Categories</span><span class="red-asterisk">*</span>
                        </div>
                        <div class="custom-select">
                            <div class="dropdown select-button" role="combobox" id="categories-select-button" onclick="toggleCategoriesSelect();">
                                <input placeholder="Select task category" type="text" required autocomplete="off" class="selected-value" id="selected-category">
                                <img class="dropdown-icon" id="dropdown-icon-categories" src="/assets/img/icons/arrow_drop_downaa.svg" alt="dropdown icon">
                            </div>
                            <ul id="categories-list" class="dropdown d-none-ni" role="listbox">
                            </ul>
                        </div>
                    </div> 
                    <div class="task-categories subtask">
                        <span>Subtasks</span>
                        <div class="input-container" id="subtask-input-container">
                            <input class="input-field" type="text" id="subtask-input" placeholder="Add new subtask" onclick="editModeSubtask()" ondblclick="incertSubtask()">
                            <img class="subtask-img icon" id="subtask-plus-icon" src="/assets/img/icons/Property 1=add.svg" alt="" onclick="editModeSubtask()">
                            <img class="subtask-img icon d-none-ni" id="subtask-close-icon" src="/assets/img/icons/Property 1=close.svg" alt="" onclick="closeEditSubtask()">
                            <img class="subtask-img icon d-none-ni" id="subtask-vector-icon" src="/assets/img/icons/Vector 19.svg">
                            <img class="subtask-img icon d-none-ni" id="subtask-check-icon" src="/assets/img/icons/Property 1=check.svg" alt="" onclick="incertSubtask()">
                        </div>
                        <ul id="select-subtask" class=""></ul>
                        <div id="select-subtask-edit" class=""></div>
                    </div>
            </div>
        </div>
        </div>
        <div class="create-delete-task-container">
            <div>
                <span class="required-field"><span class="red-asterisk">*</span>This field is required</span>
            </div>
                <div class="create-delete-task-btn" id="create-delete-task-btns-container">
                    <button id="reset" type="reset" class="button-secondary-w-icon add-task-btn" onclick="taskFormClear()">
                        Clear
                        <img src="/assets/img/icons/cancel.svg" id="clearIconHover" class="clearIconDefault">
                        <img src="/assets/img/icons/iconoir_cancel.svg" id="clearIconDefault"
                            class="clearIconBlue d-none-ni">
                    </button>
                    <button class="button-w-icon" type="submit" value="Submit">
                        ${submitBtnName}
                        <img src="./assets/img/icons/check.svg">
                    </button>
                </div>
        </div>
    </form>
    <div id="task-added" class="task-added d-none">
                <span>${popUpMsg}&nbsp;</span>
                <img src="/assets/img/icons/Vector_task_added.svg" alt="task added icon" class="icon">
    </div>
    `;
}

/**
 * Toggles the visibility of a popup element.
 * @param {string} elementId - The ID of the element to show or hide.
 * @param {boolean} show - Determines whether to show or hide the element.
 */
function showPopUp(elementId, show) {
    if (show) {
      document.getElementById(elementId).classList.remove("d-none");
    } else {
      document.getElementById(elementId).classList.add("d-none");
    }
}