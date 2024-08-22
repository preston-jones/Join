/*-- global variables --*/
// global variables for "password login visibility"
let imgs = document.querySelectorAll('.password-eye');
let imgsAsArray = Array.from(imgs);
let pwImgs = document.querySelectorAll('.pw-img');
let visibleImgs = document.querySelectorAll('.visible-img');
let pwInputs = document.querySelectorAll('.password-input');

// global variables for "remember me "
let rememberedUser = [];

// global variables for "register new user" 
let password = document.getElementById('register_password-input');
let confirm = document.getElementById('register_confirm-input');
let name = document.getElementById('register_name-input');
let email = document.getElementById('register_email-input');

// global variables for "After new user is registrated"
const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('msg');

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-- user array --*/
let users = [
    {
        name: 'hubertus',
        email: 'test123@test.de',
        password: 'test123'
    },
];

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-- init --*/
document.addEventListener('DOMContentLoaded', async function () {
    lookIfWindowIs670pxToOptimizeMobileVersion();
    await mobileAnimationsPreparing();
    await convertData();
    if (lookIfMSGParameterIsInLink() === true) {
        displayRegisterSuccessMSG();
    } else {
        loadRememberedLoginData();
    }
});

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-- load user data --*/
async function convertData() {
    users = await getItem('users');
    parsedData = JSON.parse(users);
    users = parsedData;
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-- mobile logo --*/
// prepare mobile logo
async function mobileAnimationsPreparing() {
    if (window.location.href.includes('index.html')) {
        await insertMobileLogo();
        document.querySelector('.login-logo').classList.add('animate-logo');
        document.querySelector('#animations-helper').classList.add('animate-helper');
        ifMobileLogoExistsAddAnimation();
    }
}

// insert mobile logo
async function insertMobileLogo() {
    if (window.innerWidth <= 670) {
        document.querySelector('.content').innerHTML += generateMobileLogo();
    }
}

function ifMobileLogoExistsAddAnimation() {
    if (document.getElementById('mobile-login-logo')) {
        document.getElementById('mobile-login-logo').classList.add('animate-logo')
    }
}

//generate mobile logo
function generateMobileLogo() {
    return `
    <svg id="mobile-login-logo" class="login-logo" width="101" height="122" viewBox="0 0 101 122" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
    #Vector, #Vector_2, #Vector_4, #Vector_5, #Vector_6 {
        animation: join-login-logo_animation 0.75s ease-in-out 0.23s forwards;
    }
    
    @keyframes join-login-logo_animation {
        0% {
            fill: white;
        }
        100% {
            fill: #2A3647;
        }
    }
    </style>
    <g id="Capa-2">
    <g id="Capa-1">
    <path id="Vector" d="M71.6721 0H49.5143V25.4923H71.6721V0Z" fill="white"/>
    <path id="Vector_2" d="M49.5142 46.2251H71.6721V82.1779C71.7733 90.8292 69.3112 99.3153 64.5986 106.557C59.9455 113.594 50.963 121.966 34.3446 121.966C16.2434 121.966 5.69286 113.406 0 108.715L13.9765 91.4743C19.533 96.0112 24.885 99.7435 34.4299 99.7435C41.6567 99.7435 44.5372 96.7988 46.2247 94.2307C48.5186 90.6637 49.7052 86.4923 49.6335 82.2464L49.5142 46.2251Z" fill="white"/>
    <path id="Vector_3" d="M38.2137 30.1318H16.0559V52.3884H38.2137V30.1318Z" fill="#29ABE2"/>
    <path id="Vector_4" d="M83.2793 111.522C83.2793 116.265 80.8761 118.815 77.5183 118.815C74.1605 118.815 71.9618 115.785 71.9618 111.762C71.9618 107.739 74.2287 104.554 77.7058 104.554C81.1829 104.554 83.2793 107.687 83.2793 111.522ZM74.5355 111.711C74.5355 114.57 75.6775 116.675 77.6376 116.675C79.5977 116.675 80.7056 114.45 80.7056 111.539C80.7056 108.988 79.6829 106.592 77.6376 106.592C75.5923 106.592 74.5355 108.903 74.5355 111.711Z" fill="white"/>
    <path id="Vector_5" d="M87.6768 104.76V118.593H85.2224V104.76H87.6768Z" fill="white"/>
    <path id="Vector_6" d="M90.3358 118.593V104.76H93.0629L95.9946 110.461C96.7493 111.952 97.4207 113.483 98.0058 115.049C97.8524 113.337 97.7843 111.368 97.7843 109.177V104.76H100.034V118.593H97.4945L94.5288 112.772C93.7436 111.243 93.0437 109.671 92.4323 108.064C92.4323 109.776 92.5516 111.711 92.5516 114.09V118.576L90.3358 118.593Z" fill="white"/>
    </g>
    </g>
    </svg>
    `;
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-- password login visibility --*/
// let pwImgs = document.querySelectorAll('.pw-img'); // these are global variables from the top there are used in this section of code
// let visibleImgs = document.querySelectorAll('.visible-img'); // these are global variables from the top there are used in this section of code

// while focus
pwInputs.forEach(input => {
    input.addEventListener('focus', () => {
        pwImgs.forEach(img => {
            img.classList.add('d-none');
        });
        visibleImgs.forEach(img => {
            img.classList.remove('d-none');
        });
    });
});

// if you leave focus
pwInputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value === ``) {
            pwImgs.forEach(img => {
                img.classList.remove('d-none');
            });
            visibleImgs.forEach(img => {
                img.classList.add('d-none');
            });
        }
    });
});

/* --- Password Visibility & Password eye Visibility --- */
// let imgs = document.querySelectorAll('.password-eye'); // these are global variables from the top there are used in this section of code
// let imgsAsArray = Array.from(imgs); // these are global variables from the top there are used in this section of code
function handleVisibility() {
    if (imgsAsArray.some(img => img.classList.contains('visibility-off'))) {
        addVisibility();
    } else {
        removeVisibility();
    }
}

function addVisibility() {
    imgsAsArray.forEach(img => {
        img.classList.remove('visibility-off');
        img.src = './assets/img/icons/visibility.svg';
    })
    togglePasswordVisibility();
}

function removeVisibility() {
    imgsAsArray.forEach(img => {
        img.classList.add('visibility-off');
        img.src = './assets/img/icons/visibility_off.svg';
    })
    togglePasswordVisibility();
}

// password visibility
// let pwInputs = document.querySelectorAll('.password-input'); // these are global variables from the top there are used in this section of code
function togglePasswordVisibility() {
    pwInputs.forEach(input => {
        if (input.type === 'password') {
            input.type = 'text';
        } else {
            input.type = 'password';
        }
    });
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-- login as existing user --*/
function logIn() {
    let email = document.getElementById('login-email').value;
    let password = document.getElementById('login-password').value;

    let foundUser = users.find(user => {
        return user.email === email && user.password === password;
    });

    if (foundUser) {
        rememberMe();
        sessionStorage.setItem('user', foundUser.name);
        sessionStorage.setItem('user-mail', foundUser.email)
        console.log('login succesfull');
        window.location.href = 'summary.html';
    } else {
        logInWarning();
    }
}

function logInAsGuest() {
    sessionStorage.setItem('user', 'guest');
    window.location.href = 'summary.html';
}

function logInWarning() {
    document.querySelector('#warning').classList.remove('d-none');
    document.querySelector('.forgot-password').classList.remove('d-none');
    document.querySelector('#warning').innerHTML = `Incorrect email address or incorrect password`;
}

// remember me
// let rememberedUser = []; // these are global variables from the top there are used in this section of code

function rememberMe() {
    let checkbox = document.getElementById('remember');
    if (checkbox.checked) {
        rememberedUser.push({
            email: `${document.getElementById('login-email').value}`,
            password: `${document.getElementById('login-password').value}`
        });
        localStorage.setItem('rememberMe', JSON.stringify(rememberedUser));
    } else {
        localStorage.removeItem('rememberMe');
    }
}

function loadRememberedLoginData() {
    if (window.location.href.includes('index.html') && localStorage.getItem('rememberMe')) {
        document.getElementById('remember').checked = true;
        let emailInput = document.getElementById('login-email');
        let passwordInput = document.getElementById('login-password');


        rememberedUser = JSON.parse(localStorage.getItem('rememberMe'));
        emailInput.value = rememberedUser[0].email;
        passwordInput.value = rememberedUser[0].password;
    }
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-- register new user --*/
// let password = document.getElementById('register_password-input'); // these are global variables from the top there are used in this section of code
// let confirm = document.getElementById('register_confirm-input'); // these are global variables from the top there are used in this section of code
// let name = document.getElementById('register_name-input'); // these are global variables from the top there are used in this section of code
// let email = document.getElementById('register_email-input'); // these are global variables from the top there are used in this section of code

async function registerNewUser() {
    if (await lookIfUsersAllreadyExists(email.value) === true) {
        document.querySelector('#register_warning').innerHTML = `A user with this email allready exists`;
    } else {
        if (password.value === confirm.value) {
            let newUser = generateNewUserArray(name.value, email.value, password.value);
            users.push(newUser);
            await setItem('users', users);
            window.location.href = 'index.html?msg=You have registered successfully';
        } else {
            document.querySelector('#register_warning').innerHTML = `Ups! Your password don't match, try again`;
        }
    }
}

function generateNewUserArray(name, email, password) {
    return {
        name: `${name}`,
        email: `${email}`,
        password: `${password}`
    }
}

async function lookIfUsersAllreadyExists(email) {
    await convertData();
    let foundUser = users.find(user => user.email.toLowerCase() === `${email}`.toLowerCase());
    if (foundUser) {
        return true;
    } else {
        return false;
    }
}

// After new user is registrated
// const urlParams = new URLSearchParams(window.location.search); // these are global variables from the top there are used in this section of code
// const message = urlParams.get('msg'); // these are global variables from the top there are used in this section of code

function lookIfMSGParameterIsInLink() {
    if (message === 'You have registered successfully') {
        return true;
    }
}

function displayRegisterSuccessMSG() {
    document.querySelector('.registerWasASuccess').classList.remove('d-none')
    document.querySelector('.registerWasASuccess').innerHTML += `${message}`;
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-- handle signIn signUp display --*/
function goToSite(p) {
    if (p == 1) {
        window.location.href = 'index.html';
    } else {
        if (p == 2) {
            window.location.href = 'register.html';
        }
    }
}

function handleSignUpButton() {
    let button = document.getElementById('signUp-button');
    if (button.classList.contains('d-none')) {
        button.classList.remove('d-none');
    } else {
        button.classList.add('d-none');
    }
}

function lookIfWindowIs670pxToOptimizeMobileVersion() {
    if (window.innerWidth <= 670 && document.querySelector('.switch-to-sign-up_frame').hasAttribute("signupframe")) {
        document.querySelector('.switch-to-sign-up_frame').classList.add('d-none');
    } else {
        document.querySelector('.switch-to-sign-up_frame').classList.remove('d-none');
    }
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-- if privacy and legal note is open from login --*/
function cameFromLogin(p) {
    window.location.href = `${p}.html?login=login`;
}
