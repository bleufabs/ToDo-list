function mockLogin() {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const userName = usernameInput.value;
    const passWord = passwordInput.value;
    const message = document.getElementById("login-message");
  
    //Fake user and password
    const correctUser = "admin";
    const correctPassword = "123456";
  
    message.classList.remove("success", "error");

    if (!userName || !passWord) {
        message.textContent = "Please fill in all fields.";
        message.classList.add("error");
        return false;
    }

    hashPassword(passWord).then((hashedPassword) => {
        fetch('http://localhost:3000/users')
            .then(response => response.json())
            .then(users => {
                const user = users.find(u => u.username === userName);

                if (user && user.password === hashedPassword) {
                    message.textContent = "Login successful!";
                    message.classList.add("success");

                    const loginUrl = `index.html?username=${encodeURIComponent(userName)}&password=${encodeURIComponent(passWord)}`;

                    setTimeout(() => {
                        window.location.href = loginUrl;
                    }, 1000);
                } else {
                    message.textContent = "Invalid username or password!";
                    message.classList.add("error");

                    usernameInput.value = "";
                    passwordInput.value = "";
                }
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                message.textContent = "An error occurred. Please try again later.";
                message.classList.add("error");
            });
    });
    
    return false;
}