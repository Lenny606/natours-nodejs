import axios from "axios";

const form = document.querySelector('.form');
form.addEventListener("submit", function (event) {
    event.preventDefault()
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password)
})

const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'post',
            url: 'http://localhost:8001/api/v1/users/login',
            data: {
                email,
                password
            }
        })
        if (res.data.status === 'success') {
            window.setTimeout(() => {
                location.assign("/")
            },1500)
        }
    } catch (error) {
        console.error(error)
        alert(error.response.data.message)
    }
}