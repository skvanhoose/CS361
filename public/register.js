const registerForm = document.getElementById('registerForm');
const userEmail = document.getElementById('user_email');
const userPassword = document.getElementById('user_password');

function browserAlert(message) {
    alert(message);
}

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = {
        email: userEmail.value,
        password: userPassword.value
    };
    const response = await fetch('http://localhost:4000/auth/register',{
        mode: 'cors',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    const data = await response.json();
    if (data.id) {
        browserAlert(`${data.email} is successfully registered!`)
    } else {
        browserAlert(data.detail);
    }
});