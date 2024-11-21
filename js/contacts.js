let contacts = [];

/**
 * This function loads several functions required on page load
 */
async function init() {
  await loadTemplates();
  await loadContacts();
  renderContactList();
  setCurrentPageLinkActive("contacts");

}

/**
 * This function loads all contact objects from the
 * remote storage - using getItem function - and saves them to the contacts array
 */
async function loadContacts() {
  let contactsData = await getItem("contacts");
  try {
    contacts = JSON.parse(contactsData);
    console.log(contacts);
  } catch (e) {
    console.warn("no contacts found on server");
  }
}

/**
 * This function renders the contact list with all objects found in the constacts array
 * Entries are sorted alphabetically using the sortContactsAtoZ() function
 */
function renderContactList() {
  document.getElementById("contact-list").innerHTML = "";

  sortContactsAtoZ();

  for (let i = 0; i < sortedContacts.length; i++) {
    let nameInitial = sortedContacts[i]["name"].charAt(0).toUpperCase();
    let contactListCategory = document.getElementById(
      `contact-category-${nameInitial}`
    );

    if (contactListCategory === null) {
      document.getElementById("contact-list").innerHTML +=
        returnContactListCategory(nameInitial) + returnContactListEntry([i]);
    } else {
      contactListCategory.innerHTML += returnContactListEntry([i]);
    }
  }
}

/**
 * This function returns the html to render the contact list categories
 * @param {character} character - initial letter for the category
 * @returns html to render the contact list categories
 */
function returnContactListCategory(character) {
  return `
    <p class="contact-category" 
    id="contact-category-${character}">
      ${character.toUpperCase()}
    </p>
  `;
}

/**
 * This Function return the html to render a contact list entry
 * @param {number} id - used to hand over the index of the contacts array of which the contact entry should be generated
 * @returns the html to render the contact list entry
 */
function returnContactListEntry(id) {
  let contact = contacts[id];
  return `
    <div id="contact-id-${contact["id"]
    }" class="contact-entry" onclick="renderContactDetails(${id}), highlightActiveContact(this)">
    ${renderContactInitials(returnInitials(contact["name"]), id)}
    <div>
      <name>${contact["name"]}</name>
      <email>${contact["email"]}</email>
    </div>
  </div>
`;
}

/**
 * This funtion returns the html to render a contact picture showing the initials of the contacts first and last name
 * @param {*} initials - used to hand over the initials
 * @param {*} id - used to hand over the index of the contacts array of the related contact to load the background color
 * @returns the html to render a contact picture showing the initials of the contacts first and last name
 */
function renderContactInitials(initials, id) {
  return `
  <div class="acc-initials" style="background-color:${contacts[id]["bgColor"]}" >
      <p>${initials}</p>
    </div>
  `;
}

/**
 * This funtion removes the .contact-entry-active css class from all elements
 * and then adds the class to the element who triggered the function
 */
function highlightActiveContact(element) {
  if (window.innerWidth >= 1024) {
    Array.from(document.querySelectorAll(".contact-entry-active")).forEach(
      (el) => el.classList.remove("contact-entry-active")
    );
    element.classList.add("contact-entry-active");
  }
}

/**
 * This function copies the contacts array to the sortedContacts array
 * and then sorts the array from a to z based on the first letter of the objects name
 */
function sortContactsAtoZ() {
  sortedContacts = contacts;
  console.log(sortedContacts);

  sortedContacts.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    let charsA = nameA.split("");
    let charsB = nameB.split("");

    for (let i = 0; i < charsA.length; i++) {
      if (charsA[i] < charsB[i]) return -1;
      if (charsA[i] > charsB[i]) return 1;
      return 0;
    }
  });
}

/**
 * This function renders the contact details
 * @param {number} id - index of the object within the contacts array
 */
function renderContactDetails(id) {
  renderContactDetailsMobile(id);
  document.getElementById("contact-details").classList.remove("d-none");
  document.getElementById("contact-innitials").innerHTML =
    renderContactInitials(returnInitials(contacts[id]["name"]), id);
  document.getElementById("contact-name").innerHTML = contacts[id]["name"];
  document.getElementById("contact-email").innerHTML = contacts[id]["email"];
  document.getElementById("contact-email").href = `
  mailto:${contacts[id]["email"]}`;
  document.getElementById("contact-phone").innerHTML = contacts[id]["phone"];
  document
    .getElementById("contact-delete")
    .setAttribute("onclick", `deleteContact(${id})`);
  document
    .getElementById("contact-edit")
    .setAttribute("onclick", `showEditContactForm(${id})`);
}

/**
 * This function is a sublement to renderContactDetails(id) to optimize design on mobile devices
 * @param {number} id - index of the object within the contacts array
 */
function renderContactDetailsMobile(id) {
  if (window.innerWidth <= 1024) {
    document.getElementById("contact-container").classList.add("d-flex");
    document.getElementById("contact-list-container").classList.add("d-none");
    document
      .getElementById("contact-mobile-delete")
      .setAttribute("onclick", `deleteContact(${id}),hideMore()`);
    document
      .getElementById("contact-mobile-edit")
      .setAttribute("onclick", `showEditContactForm(${id}),hideMore()`);
  }
}

/**
 * This function hides the Contact details
 */
function hideContactDetails() {
  document.getElementById("contact-container").classList.remove("d-flex");
  document.getElementById("contact-list-container").classList.remove("d-none");
}

/**
 * This function shows the Add Contact Form
 */
function showAddContactForm() {
  document
    .getElementById("add-contact-form-container")
    .classList.remove("fadeOut");
  document.getElementById("add-contact-bg").classList.remove("d-none");
  document.getElementById("add-contact-form-container").classList.add("fadeIn");
}

/**
 * This function creates a new contact objects, pushes the object to the contacts array
 * and then re-render the page
 */
async function createNewContact() {
  const randomBgColorIndex = Math.floor(
    Math.random() * backgroundColors.length
  );

  contacts.push({
    id: Date.now(),
    name: document.getElementById("add-contact-name").value,
    email: document.getElementById("add-contact-email").value,
    phone: document.getElementById("add-contact-phone").value,
    bgColor: backgroundColors[randomBgColorIndex],
  });

  await setItem("contacts", contacts);

  renderContactList();
  highlightLatestContact();
  closeAddContactForm();
  setTimeout(showContactCreatedNotification, 2000);
}

/**
 * This function closes the Add Contact form
 */
function closeAddContactForm() {
  document
    .getElementById("add-contact-form-container")
    .classList.remove("fadeIn");
  document
    .getElementById("add-contact-form-container")
    .classList.add("fadeOut");
  setTimeout(resetAddContactForm, 950);
}

/**
 * This function resets the Add Contact form
 */
function resetAddContactForm() {
  document.getElementById("add-contact-bg").classList.add("d-none");
  document.getElementById("add-contact-name").value = "";
  document.getElementById("add-contact-email").value = "";
  document.getElementById("add-contact-phone").value = "";
}

/**
 * This function highlights the last created contact in the contact list
 */
function highlightLatestContact() {
  const idOfmostRecentObject = Math.max(...contacts.map((e) => e.id));
  const index = contacts.findIndex((i) => i.id == idOfmostRecentObject);

  let element = document.getElementById(`contact-id-${idOfmostRecentObject}`);

  Array.from(document.querySelectorAll(".contact-entry-active")).forEach((el) =>
    el.classList.remove("contact-entry-active")
  );

  element.classList.add("contact-entry-active");
  element.scrollIntoView(false);

  renderContactDetails(index);
}

/**
 * This function shows a notification when a new contact is created
 */
async function showContactCreatedNotification() {
  document.getElementById("contact-created").classList.remove("d-none");
  document
    .getElementById("contact-created")
    .classList.add("createdNotification");
  await setTimeout(() => {
    document.getElementById("contact-created").classList.add("d-none");
  }, 1950);
}

/**
 * This function deletes a object from the contacts array
 * @param {number} id - index of the object to be deleted
 */
async function deleteContact(id) {
  contacts.splice(id, 1);
  await setItem("contacts", contacts);
  document.getElementById("contact-details").classList.add("d-none");
  renderContactList();

  if (window.innerWidth <= 1024) {
    hideContactDetails();
  }
}

/**
 * This function shows the Edit Contact Form
 * @param {number} id - index of the object in the contacts array which should be edited
 */
function showEditContactForm(id) {
  loadEditContactValues(id);
  document
    .getElementById("edit-contact-form-container")
    .classList.remove("fadeOut");
  document.getElementById("edit-contact-bg").classList.remove("d-none");
  document
    .getElementById("edit-contact-form-container")
    .classList.add("fadeIn");
}

/**
 * This function loads the contact objects property values into the Edit Contact Form
 * @param {number} id
 */
function loadEditContactValues(id) {
  const contact = contacts[id];
  document.getElementById("edit-contact-name").value = contact["name"];
  document.getElementById("edit-contact-phone").value = contact["phone"];
  document.getElementById("edit-contact-email").value = contact["email"];
  document
    .getElementById("edit-contact-form")
    .setAttribute("onsubmit", `editContact(${id}); return false`);
}

/**
 * This function saves the edited contact object into the contacts array
 * @param {number} id - index of the object that was edited
 */
async function editContact(id) {
  contacts[id] = {
    id: contacts[id]["id"],
    name: document.getElementById("edit-contact-name").value,
    email: document.getElementById("edit-contact-email").value,
    phone: document.getElementById("edit-contact-phone").value,
    bgColor: contacts[id]["bgColor"],
  };

  await setItem("contacts", contacts);
  closeEditContactForm();
  renderContactList();
  renderContactDetails(id);
}

/**
 * This function resets the Edit Contact Form
 */
function resetEditContactForm() {
  document.getElementById("edit-contact-bg").classList.add("d-none");
  document.getElementById("edit-contact-name").value = "";
  document.getElementById("edit-contact-email").value = "";
  document.getElementById("edit-contact-phone").value = "";
}

/**
 * This function closes the Edit Contact Form
 */
function closeEditContactForm() {
  document
    .getElementById("edit-contact-form-container")
    .classList.remove("fadeIn");
  document
    .getElementById("edit-contact-form-container")
    .classList.add("fadeOut");
  setTimeout(resetEditContactForm, 950);
}

/**
 * This function opens the showMore Menu which contains edit and delete buttons on mobile design
 */
function showMore() {
  document.getElementById("content-container-more").classList.remove("d-none");
  document
    .getElementById("content-container-more")
    .classList.remove("fadeOutMore");
  document.getElementById("content-container-more").classList.add("fadeInMore");
}

/**
 * This function hides the showMore Menu which contains edit and delete buttons on mobile design
 */
function hideMore() {
  document
    .getElementById("content-container-more")
    .classList.remove("fadeInMore");
  document
    .getElementById("content-container-more")
    .classList.add("fadeOutMore");
  setTimeout(() => {
    document.getElementById("content-container-more").classList.add("d-none");
  }, 950);
}

/**
 * This function adds the .input-invalid css class when input is not valid
 * @param {string} element
 */
function highlightInvalid(element) {
  if (!element.checkValidity())
    element.parentNode.classList.add("input-invalid");
  else element.parentNode.classList.remove("input-invalid");
}
