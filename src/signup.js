function mockSignup() {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const correctPasswordInput = document.getElementById("confirm-password");
    const message = document.getElementById("signup-message");

    const username = usernameInput.value;
    const password = passwordInput.value;
    const confirmPassword = correctPasswordInput.value;

    message.classList.remove("success", "error");

    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match!";
        message.classList.add("error");

        passwordInput.value = "";
        correctPasswordInput.value = "";
        return false;
    }

    message.textContent = "Sign up successful!";
    message.classList.add("success");

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1000);

    return false;
}
