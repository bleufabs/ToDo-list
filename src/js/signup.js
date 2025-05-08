function mockSignup() {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const correctPasswordInput = document.getElementById("confirm-password");
    const message = document.getElementById("signup-message");

    const username = usernameInput.value;
    const password = passwordInput.value;
    const confirmPassword = correctPasswordInput.value;

    message.classList.remove("success", "error");

    if (!username || !password) {
        message.textContent = "Please fill in all fields.";
        message.classList.add("error");
        return false;
    }

    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match!";
        message.classList.add("error");

        passwordInput.value = "";
        correctPasswordInput.value = "";
        return false;
    }

    hashPassword(password).then((hashedPassword) => {
        fetch('http://localhost:3000/users?username=${encodeURIComponent(username)}')
        .then(response => response.json())
        .then(users => {
            if (users.length > 0) {
                message.textContent = "Username already exists!";
                message.classList.add("error");
            } else {
                //post
                fetch('http://localhost:3000/users', {
                    method: 'POST',
                    headers: {'Content-Type' : 'application/json'},
                    body: JSON.stringify({
                        username: username,
                        password: hashedPassword
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Signup failed');
                    }
                    message.textContent = "Signup successful!";
                    message.classList.add("success");

                    setTimeout(() => {
                        window.location.href = "login.html";
                    }, 1500);
                })
            }
        })
        .catch(error => {
            console.error(error);
            message.textContent = "Error checking username.";
            message.classList.add("error");
        });
    })
    
    return false;
    
}
