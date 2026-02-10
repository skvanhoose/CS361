const helpSubmit = document.getElementById('comments-submit');

helpSubmit.addEventListener('click', (event) => {
    event.preventDefault();
    const commentInput = document.getElementById('help-comments');
    var commentText = commentInput.value;
    const sendComment = {
    feedback: commentText
    };
    fetch('http://localhost:8000/post-comment',{
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sendComment)
})
.then(response => response.json())
.then(data => { 
    alert(data);
    location.reload();
})
.catch((e) => {
    alert(e);
    location.reload();
})});