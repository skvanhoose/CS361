const header = document.querySelector('h1')
const userEmail = document.getElementById('user_email');
const userPassword = document.getElementById('user_password');
const loginForm = document.getElementById('loginForm');

function browserAlert(message) {
    alert(message);
}

async function callLoginService(payload) {
        await fetch('http://localhost:4000/auth/login',{
        mode: 'cors',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
    })
}

document.addEventListener('DOMContentLoaded', async (req, res) => {
       const response = 
            await fetch('http://localhost:4000/',{
            mode: 'cors',
        })

        const data = await response.json();
        header.textContent = data.message;
});

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
     const payload = {
        email: userEmail.value,
        password: userPassword.value,
        refresh: false
    };
    await callLoginService(payload);
    await fetch('http://localhost:3000/private/dashboard',{
        mode: 'cors',
        method: 'GET',
        credentials: 'include',
    })
    .then(async response => {
        if (response.ok) {
            window.location.href = 'http://localhost:3000/private/dashboard'; 
        } else {
            try {
                const data = await response.json();
                const message = data.detail || data.error || 'Unknown error';
                alert(`Login failed. Try again: ${message}`);
            } catch (e) {
                alert('Login failed. Please try again.');
            }
            window.location.href = 'http://localhost:3000/';
        }
    })});


export { callLoginService };
