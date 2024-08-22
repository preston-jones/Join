const SUBTASK_ID = 0;
const SUBTASK_TEXT = 1;
const SUBTASK_DONE = 2;

let subtasks = [];

/**
 * Adds the first subtask to the list if the input is not empty.
 * Generates a unique ID for the subtask, creates a list item,
 * and resets the subtask input field.
 */
function editModeSubtask(){
    const subTaskPlusIcon = document.getElementById('subtask-plus-icon');
    const subTaskCheckIcon = document.getElementById('subtask-check-icon');
    const subTaskVectorIcon = document.getElementById('subtask-vector-icon');
    const subTaskCloseIcon = document.getElementById('subtask-close-icon');
    subTaskPlusIcon.classList.add('d-none-ni');
    subTaskCheckIcon.classList.remove('d-none-ni');
    subTaskCloseIcon.classList.remove('d-none-ni');
    subTaskVectorIcon.classList.remove('d-none-ni');
}

/**
 * Inserts a subtask into the task list.
 */
function incertSubtask() {
    const subtaskInput = document.getElementById('subtask-input');
    const subtaskText = subtaskInput.value.trim();
    
    if (subtaskText !== '') {
        createSubtaskListItem(subtaskText);
        resetSubtaskInput(subtaskInput);
        closeEditSubtask();
    }
    else{
        closeEditSubtask();
    }
}

/**
 * Closes the edit subtask section and resets the subtask input.
 */
function closeEditSubtask(){
    const subtaskInput = document.getElementById('subtask-input');
    const subTaskPlusIcon = document.getElementById('subtask-plus-icon');
    const subTaskCheckIcon = document.getElementById('subtask-check-icon');
    const subTaskVectorIcon = document.getElementById('subtask-vector-icon');
    const subTaskCloseIcon = document.getElementById('subtask-close-icon');
    subTaskPlusIcon.classList.remove('d-none-ni');
    subTaskCheckIcon.classList.toggle('d-none-ni');
    subTaskCloseIcon.classList.toggle('d-none-ni');
    subTaskVectorIcon.classList.toggle('d-none-ni');
    resetSubtaskInput(subtaskInput);
}

/**
 * Renders the HTML for the subtask edit mode.
 * 
 * @param {string} subtaskText - The text of the subtask.
 * @param {string} subtaskId - The ID of the subtask.
 * @returns {string} The HTML markup for the subtask edit mode.
 */
function renderEditModeSavedSubtask(subtaskText, subtaskId) {
    return /*html*/`
    <div class="subtask-item input-container width-small" id="${subtaskId}-input"> 
        <input class="input-field" type="text" value="${subtaskText}" id="${subtaskId}-edit-subtask-input">
        <div class="subtask-icons visible" id="subtask-icons-saved-edit-${subtaskId}">
            <div class="check_icon_div">
                <img class="subtask-img icon" id="subtask-check-icon" src="/assets/img/icons/Property 1=check.svg" alt="" onclick="updateSavedSubtask('${subtaskText}', ${subtaskId})">
            </div>
            <div class="vector_icon_div">
                    <img class="add-subtaskicons icon vector" src="/assets/img/icons/Vector 19.svg" alt="">
                </div>
            <div class="delete_icon_div">
                <img class="subtask-img icon" id="subtask-close-icon" src="/assets/img/icons/Property 1=close.svg" alt="" onclick="closeEditSavedSubtask('${subtaskText}', '${subtaskId}')">
            </div>
        </div>
    </div>
`;
}

/**
 * Entering edit sutask mode.
 * 
 * @param {string} subtaskText - The text of the subtask.
 * @param {string} subtaskId - The ID of the subtask.
 */
function editModeSavedSubtask(subtaskText, subtaskId) {
    const selectSubtaskEdit = document.getElementById(`${subtaskId}`);
    selectSubtaskEdit.classList.add('display-block');
    selectSubtaskEdit.innerHTML = renderEditModeSavedSubtask(subtaskText, subtaskId);
    focusEditSavedSubtask(`${subtaskId}-edit-subtask-input`);
}

/**
 * Closes the edit mode for a subtask.
 * 
 * @param {string} subtaskText - The updated text of the subtask.
 * @param {string} subtaskId - The ID of the subtask.
 */
function closeEditSavedSubtask(subtaskText, subtaskId) {
    let selectSubtaskEditItem = document.getElementById(`${subtaskId}`);
    if (selectSubtaskEditItem) {
        selectSubtaskEditItem.innerHTML = "";
        selectSubtaskEditItem.innerHTML = renderSubtaskListItem(subtaskText, subtaskId);    }
}

/**
 * Sets focus on the input element with the specified ID.
 * @param {string} elementId - The ID of the input element.
 */
function focusEditSavedSubtask(elementId){
    const editSubtaskInput = document.getElementById(elementId);
    if (editSubtaskInput) {
        editSubtaskInput.focus();
    }
}

/**
 * Updates the saved subtask with the provided text.
 * @param {string} subtaskText - The updated text for the subtask.
 * @param {string} subtaskId - The ID of the subtask.
 */
function updateSavedSubtask(subtaskText, subtaskId) {
    const editSubtaskInput = document.getElementById(`${subtaskId}-edit-subtask-input`);
    const updatedText = editSubtaskInput.value.trim();

    if (updatedText !== '') {
        editSubtaskInput.value = updatedText;
        subtaskText = updatedText;
        const index = subtasks.findIndex((subtask) => subtask[SUBTASK_ID] === subtaskId);
        if (index !== -1) {
            subtasks[index][SUBTASK_TEXT] = subtaskText;
        }
    }
    closeEditSavedSubtask(subtaskText, subtaskId);
}

/**
 * Creates a subtask list item and adds it to the select-subtask list.
 * 
 * @param {string} subtaskText - The text of the subtask.
 * @returns {void}
 */
function createSubtaskListItem(subtaskText) {
    const selectSubtaskList = document.getElementById('select-subtask');
    const subtaskId = generateUniqueID();
    selectSubtaskList.innerHTML += renderSubtaskListItem(subtaskText, subtaskId);
    subtasks.push([subtaskId, subtaskText, false]);
}

/**
 * Renders a subtask list item with the given subtask text and ID.
 * @param {string} subtaskText - The text of the subtask.
 * @param {string} subtaskId - The ID of the subtask.
 * @returns {string} The HTML representation of the subtask list item.
 */
function renderSubtaskListItem(subtaskText, subtaskId) {
    return /*html*/`
    <li id="${subtaskId}" class="subtask-li" ondblclick="editModeSavedSubtask('${subtaskText}', '${subtaskId}')">
        <div class="subtask-item">
            <div>${subtaskText}</div>
            <div class="subtask-icons" id="subtask-icons-edit-${subtaskId}">       
                <div class="pencil_icon_div">
                    <img class="add-subtaskicons icon pencil" src="/assets/img/icons/Property 1=edit.svg" alt="" onclick="editModeSavedSubtask('${subtaskText}', '${subtaskId}')">
                </div>
                <div class="vector_icon_div">
                    <img class="add-subtaskicons icon vector" src="/assets/img/icons/Vector 19.svg" alt="">
                </div>
                <div class="delete_icon_div">
                    <img class="add-subtaskicons icon delete" src="/assets/img/icons/Property 1=delete.svg" alt="" onclick="deleteSubtask(event, ${subtaskId})">
                </div>
            </div>
        </div>
    </li>
`;
}

/**
 * Deletes a subtask from the subtasks array and removes it from the DOM.
 * @param {Event} event - The event object triggered by the user action.
 * @param {string} subtaskId - The ID of the subtask to be deleted.
 */
function deleteSubtask(event, subtaskId) {
    const subtaskItem = event.target.closest('li');
    if (subtaskItem) {
        const index = subtasks.findIndex((task) => task[SUBTASK_ID] === subtaskId);
        if (index !== -1) {
            subtasks.splice(index, 1);
        }
        subtaskItem.remove();
    }
}