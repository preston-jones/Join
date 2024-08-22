let currentUrl;
let currentPageName;
let pageToDeactivate;
let currentUser =
  "Guest"; /* placeholder until logged in user is handed over from login */

async function loadTemplates() {
  await includeHTML();
  renderUserIcon();
}

async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

function showSubmenu() {
  document.getElementById("submenu_container").classList.toggle("show_submenu");
}

// -- Links --
function goToPage(clickedLink) {
  window.open(`./${clickedLink}.html`, "_self");
}

function getCurrentPageName(pageName) {
  currentPageName = pageName;
  return currentPageName;
}

function setCurrentPageLinkActive(pageName) {
  getCurrentPageName(pageName);
  checkIfLinkIsActive();
  setMenuLinkActive();
  changeMenuLinkImage();
}

function checkIfLinkIsActive() {
  if (!pageToDeactivate) {
    setMenuLinkActive();
  } else {
    removeMenuLinkActive();
    setMenuLinkActive();
  }
}

function setMenuLinkActive() {
  const menuLink = document.getElementById(`sidebar_link_${currentPageName}`);
  menuLink.classList.add("sidebar_link_active", "sidebar_link_active:hover");
  pageToDeactivate = currentPageName;
}

function removeMenuLinkActive() {
  const menuLink = document.getElementById(`sidebar_link_${pageToDeactivate}`);
  menuLink.classList.remove("sidebar_link_active", "sidebar_link_active:hover");
}

function changeMenuLinkImage() {
  const image = document.getElementById(`menu_icon_${currentPageName}`);
  image.src = `assets/img/icons/${currentPageName}_icon_white.svg`;
}

/* essential for sidebar pls not delete */
function openNewSite(p) {
  window.location.href = `${p}.html`;
}

function renderUserIcon() {
  let element = document.getElementById("header_user_initials_container");
  if (sessionStorage.getItem("user"))
    currentUser = sessionStorage.getItem("user");

  element.innerHTML = `
      <div class="header_user_initials_box">
        ${returnInitials(currentUser)}
      </div>
`;
}

function returnInitials(string) {
  let words = string.split(" ");
  let innitials = "";

  for (let i = 0; i < words.length; i++) {
    innitials += words[i].charAt(0).toUpperCase();
  }

  return innitials;
}
