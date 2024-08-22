/**
 * Renders a task card with the given task data and appends it to the element with the specified ID.
 * 
 * @param {string} elementId - The ID of the element to which the task card will be appended.
 * @param {object} task - The task object containing the task data.
 */
function renderTaskCard(elementId, task){
    let taskCard = document.getElementById(elementId);
    taskCard.innerHTML += /*html*/`
        
    <div class="container dp-flex flex-column" id="task-card-id-${task['taskID']}" style="align-items: flex-start; margin: 40px; padding: 40px;">
    <div class="task-categories">
        <span>${task['category']['name']}</span> 
    </div>

    <div class="task-categories">
        <span>${task['title']}</span>
    </div>
    <div class="task-categories description">
        <span>${task['description']}</span>
    </div>

    <div class="task-categories">
        <span>Due date: ${normalDate(task['date'])}</span>
    </div>
    <div class="task-categories">
        <span>Priority: ${renderPriority(task['prio'], true)}</span>
    </div>
    <div class="task-categories">
        <span>Assigned to:</span>
        <div id="assigned-user-icons-container">
            ${renderAssignedUserIcons(task['assignedUsers'])}
        </div>       
    </div>
    <div class="task-categories">
        <span>Subtasks</span>
        <div class="subtask-container-list" id="subtask-container-list-${task['taskID']}">
        ${renderSubtasks(task.taskID, task.subtasks)}
        </div>
    </div>       
    <div class="create-delete-task-container">
        <div class="create-delete-task-btn" id="create-delete-task-btns-container">
                <button id="reset" type="reset" class="button-secondary-w-icon add-task-btn" onclick="deleteTask(${task['taskID']}); showPopUp('${elementId}', false)">
                    Delete   
                    <img src="/assets/img/icons/cancel.svg" id="clearIconHover" class="clearIconDefault">
                    <img src="/assets/img/icons/iconoir_cancel.svg" id="clearIconDefault" class="clearIconBlue d-none">
                </button>
                <button class="button-w-icon" type="submit" onclick="renderEditTaskForm('${elementId}', ${task['taskID']})">
                    Edit<img src="./assets/img/icons/check.svg" />
                </button>
        </div>
        <div id="edit-mode-task"></div>
    </div>
</div>
`;
}
