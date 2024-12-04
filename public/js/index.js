//entry point JS file
import '@babel/polyfill'
import {login} from "./login.js";
import {displayMap} from "./mapbox.js";

const mapbox = document.getElementById('map')
const form = document.querySelector('.form');

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