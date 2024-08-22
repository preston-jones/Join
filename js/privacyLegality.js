/* init */
document.addEventListener('DOMContentLoaded', async () => {
    await loadTemplates();
    lookIfLoginParameterIsInLink();
    renderUsersMailAddressIntoLegalNotice()
});

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/* functions to display visibility from privacy & legal note links, in the sidebar, depending from wich site you came */
function lookIfLoginParameterIsInLink() {
    const urlParams = new URLSearchParams(window.location.search);
    const login = urlParams.get('login');

    if (login === 'login') {
        hideLinks();
        removeHrefFromLinks();
        document.getElementById('privacy-link').removeAttribute('onclick');
        document.getElementById('legality-link').removeAttribute('onclick');
        document.getElementById('privacy-link').setAttribute('onclick', 'cameFromLogin(`privacy`)');
        document.getElementById('legality-link').setAttribute('onclick', 'cameFromLogin(`legality`)');
    }
}

function hideLinks() {
    document.getElementById('main-nav-links').classList.add('d-none');
}

function cameFromLogin(p) {
    window.location.href = `${p}.html?login=login`;
}

function removeHrefFromLinks() {
    document.getElementById('privacy-link').setAttribute('href', '#');
    document.getElementById('legality-link').setAttribute('href', '#');
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/* Render the mail address from exploring user into legal notice */
function renderUsersMailAddressIntoLegalNotice() {
    document.getElementById('users-email').innerHTML = `email: ${sessionStorage.getItem('user-mail')}`;
}