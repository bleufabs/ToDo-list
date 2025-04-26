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
  
    if (userName === correctUser && passWord === correctPassword) {
        message.textContent = "Login successful!";
        message.classList.add("success");
  
        const loginUrl = `index.html?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}`;
  
        setTimeout(() => {
            window.location.href = loginUrl;
        }, 1000);
    } else {
        message.textContent = "Invalid username or password!";
        message.classList.add("error");
  
        usernameInput.value = "";
        passwordInput.value = "";
    }
  
    return false;
  }
  