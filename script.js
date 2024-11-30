async function register() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });
    const result = await response.json();

    if (result.success) {
        alert('註冊成功，請登入');
        window.location.href = 'index.html';
    } else {
        alert(result.message);
    }
}
