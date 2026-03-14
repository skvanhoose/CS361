const myButton = document.querySelector('.logout-button');

myButton.addEventListener('click', async () => {
    try {
        await fetch('http://localhost:8000/logout-procedures',{
        mode: 'cors',
        method: 'PUT',
        credentials: 'include',
        })
    } catch (error) {
        alert('Logout failed')
    }

    window.location.replace('http://localhost:3000/')
});