//entry point JS file
import '@babel/polyfill'
import {login} from "./login.js";
import {displayMap} from "./mapbox.js";
import {logout} from "./logout.js";
import {updateData} from "./updateAdminSettings.js";

const mapbox = document.getElementById('map')
const form = document.querySelector('.form--login');
const formAdminUserData = document.querySelector('.form-user-data');
const logoutBtn = document.querySelector('.nav__el--logout');

if (mapbox) {
    const locations = JSON.parse(document.getElementById('map').dataset.locations)
    displayMap(locations)
}

if (form) {
    form.addEventListener("submit", function (event) {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        event.preventDefault()
        login(email, password)
    })
}
if (formAdminUserData) {
    form.addEventListener("submit", function (event) {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        event.preventDefault()
        updateData(name, email)
    })
}
if (logoutBtn) {
    logoutBtn.addEventListener("click", function (event) {
        logout()
    })
}