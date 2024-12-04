//entry point JS file
import '@babel/polyfill'
import {login} from "./login.js";
import {displayMap} from "./mapbox.js";
import {logout} from "./logout.js";

const mapbox = document.getElementById('map')
const form = document.querySelector('.form');
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
if (logoutBtn) {
    logoutBtn.addEventListener("click", function (event) {
        logout()
    })
}