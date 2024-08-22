let assignUserList = [];
let usersList = [];

/**
 * Retrieves the selected user from the user-select element and adds their ID to the assignUserList array.
 */
function getSelectedUser(){
    let user = document.getElementById('user-select').value;
    let userID = parseInt(user.replace('User', ''));
    assignUserList.push(userID);
}

/**
 * Renders the full list of users by fetching data from the remote server and rendering it on the HTML page.
 * @returns {Promise<void>} A promise that resolves when the rendering is complete.
 */
async function renderFullUsersList() {
    usersList = await getRemote('contacts');
    renderHTMLUsersList(usersList);
}

/**
 * Toggles the checkbox for a user.
 * 
 * @param {number} userId - The ID of the user.
 * @returns {HTMLInputElement} - The checkbox element for the user.
 */
function checkboxToggle(userId) {
    const userCheckbox = document.getElementById('dropdown-user-' + userId.toString());
    userCheckbox.checked = !userCheckbox.checked;
    return userCheckbox;
}

/**
 * Handles the click event on the user dropdown.
 * @param {string} userId - The ID of the user.
 */
function userDropDownClick(userId) {
    const userCheckbox = checkboxToggle(userId)
    selectOption(userCheckbox, userId);
}

/**
 * Renders the user icon dropdown.
 * 
 * @param {object} user - The user object.
 * @returns {string} The HTML string representing the user icon dropdown.
 */
function renderUserIconDropdown(user){
    return /*html*/`
        <div class="initials-name">
            <div class="acc-initials" style="background-color:${user['bgColor']}">
                <p>${returnInitials(user['name'])}</p>
            </div>
            <div>
                ${user['name']}
            </div>
        </div>
    `;
}

/**
 * Reverts the toggle state of a checkbox for a given user ID.
 * @param {string} userId - The ID of the user.
 */
function checkboxRevertToggle(userId) {
    checkboxToggle(userId);
}

/**
 * Renders the HTML for the users list dropdown.
 * 
 * @param {Array} usersList - The list of users.
 */
function renderHTMLUsersList(usersList){
    let dropdown = document.getElementById('select-dropdown-users');
    dropdown.innerHTML = '';
    for (let index = 0; index < usersList.length; index++) {
        let user = usersList[index];
        dropdown.innerHTML += /*html*/`
        <div class="user-option" onclick="userDropDownClick(${user.id})" 
            style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: space-between; padding-bottom: 10px;">
            ${renderUserIconDropdown(user)}
            <input type="checkbox" role="option" class="contact-entry-task" id='dropdown-user-${user.id}'
                data-name="${user.name}" onclick="checkboxRevertToggle(${user.id})" />
        </div>
        `;
    }
    if (assignUserList.length != 0) {
        assignUserList.forEach((assignedUser) => {
            const userCheckbox = document.getElementById('dropdown-user-' + assignedUser.id.toString());
            userCheckbox.checked = true;
        });
    }
} 

/**
 * Toggles the visibility of a custom select dropdown.
 */
function toggleCustomSelect() {
    let dropdown = document.getElementById('select-dropdown-users');
    let dropdownIcon = document.getElementById('dropdown-icon-users');
    dropdownIcon.classList.toggle("rotate");
    dropdown.classList.toggle("d-none-ni");
}

/**
 * Removes the visibility of the input users dropdown.
 */
function toggleInputUsers() {
    let dropdown = document.getElementById('select-dropdown-users');
    dropdown.classList.remove("d-none-ni");
}

/**
 * Removes the assigned user with the specified ID from the list.
 * @param {number} id - The ID of the user to be removed.
 */
function removeAssignedUser(id) {
    document.getElementById('selected-icon-user-assigned-' + id.toString()).remove();
    const index = assignUserList.findIndex((user) => user.id === id);
    if (index != -1) {
        assignUserList.splice(index, 1);
    }
}

/**
 * Renders the task users on the selected users container.
 * @param {Array} assignedUserList - The list of assigned users.
 */
function renderTaskUses(assignedUserList) {
    const selectedUsersContainer = document.getElementById('selected-users-container');
    selectedUsersContainer.innerHTML = '';
    for (let i = 0; i < assignedUserList.length; i++) {
        const user = assignedUserList[i];
        renderTaskUserIcon(user.id, user.bgColor, user.name, -assignUserList.length);
    }
}

/**
 * Renders a task user icon with the specified user ID, user colour, user name, and margin right.
 * @param {number} userID - The ID of the user.
 * @param {string} userColour - The colour of the user icon.
 * @param {string} userName - The name of the user.
 * @param {number} marginRight - The margin right value for the user icon.
 */
function renderTaskUserIcon(userID, userColour, userName, marginRight) {
    const selectedUsersContainer = document.getElementById('selected-users-container');
    selectedUsersContainer.innerHTML +=  /*html*/`
        <div class="selected-icon" id="selected-icon-user-assigned-${userID.toString()}" onclick="removeAssignedUser(${userID})">
            <div class="acc-initials" style="background-color:${userColour}; margin-right:${marginRight}px;">
                <p>${returnInitials(userName)}</p>
            </div>
        </div>
    `;
}

/**
 * Handles user selection in the dropdown menu.
 * If the checkbox is checked, the corresponding user icon is added to the list and 
 * removed from the dropdown.
 * 
 * @param {HTMLInputElement} checkbox - The checkbox element.
 * @param {number} id - The ID of the selected option.
 */
function selectOption(checkbox, id) {
    if (checkbox.checked) {
        const index = usersList.findIndex((user) => user.id === id);
        if (index != -1) {
            const idx = assignUserList.findIndex((user) => user.id === id);
            if (idx == -1) {
                assignUserList.push(usersList[index]);
            }
        }
    } else {
        const idx = assignUserList.findIndex((user) => user.id === id);
        if (idx != -1) {
            assignUserList.splice(idx, 1);
        }
    }
    renderTaskUses(assignUserList);
}

/**
 * Filters the users based on the search input and renders the filtered list.
 * If the users list is empty, it fetches the contacts remotely.
 */
async function filterUsers() {
    let search = document.getElementById('search').value;
    search = search.toLowerCase();
    if(usersList.length == 0){
        usersList = await getRemote('contacts');
    }
    let filteredList = [];
    if (search != '') {
        for (let i = 0; i < usersList.length; i++) {
            let name = usersList[i].name;
            if (name.toLowerCase().includes(search)) {
                filteredList.push(usersList[i]);
            }
        }
    }
    if (filteredList.length == 0) {
        filteredList = usersList;
    }
    renderHTMLUsersList(filteredList);
}

/**
 * Callback for closing dropdown on click outside
*/
document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('select-dropdown-users');
    const dropdownContainer = document.getElementById('select-users');
    const dropdownIcon = document.getElementById('dropdown-icon-users');

    if(dropdownContainer){
        if (!dropdownContainer.contains(event.target)) {
            dropdown.classList.add('d-none-ni');
            dropdownIcon.classList.remove('rotate');
            document.getElementById('search').value = "";
        }
    }
});
