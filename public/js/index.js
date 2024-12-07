//entry point JS file
import '@babel/polyfill'
import {login} from "./login.js";
import {displayMap} from "./mapbox.js";
import {logout} from "./logout.js";
import {updateAdminSettings} from "./updateAdminSettings.js";

const mapbox = document.getElementById('map')
const form = document.querySelector('.form--login');
const formAdminUserData = document.querySelector('.form-user-data');
const formAdminPassword = document.querySelector('.form-user-password');
const logoutBtn = document.querySelector('.nav__el--logout');

if (mapbox) {
    const locations = JSON.parse(document.getElementById('map').dataset.locations)
    displayMap(locations)
}

if (form) {
    form.addEventListener("submit", function (event) {
        event.preventDefault()
        login
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        (email, password)
    })
}
if (formAdminUserData) {
    formAdminUserData.addEventListener("submit", function (event) {
        event.preventDefault()
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        updateAdminSettings({name, email}, 'data')
    })
}
if (formAdminPassword) {
    formAdminPassword.addEventListener("submit",  async function (event) {
        event.preventDefault()
        const btn = document.querySelector('.btn--save-password').textContent = "Updating..."
        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;

        //async
        await updateAdminSettings({passwordCurrent, password, passwordConfirm}, 'password')

        //clear form
        passwordCurrent.value = ''
        password.value = ''
        passwordConfirm.value = ''
        btn.textContent = "Saved Password"

    })
}
if (logoutBtn) {
    logoutBtn.addEventListener("click", function (event) {
        logout()
    })
}