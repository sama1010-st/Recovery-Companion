// =====================================
// Recovery Companion - Demo Authentication
// =====================================

// Get saved demo users
function getUsers() {
    return JSON.parse(localStorage.getItem("demoUsers")) || [];
}

// Save demo users
function saveUsers(users) {
    localStorage.setItem("demoUsers", JSON.stringify(users));
}

// Display messages
function showMessage(message, type = "error") {
    const messageElement = document.getElementById("message");

    if (messageElement) {
        messageElement.textContent = message;
        messageElement.style.display = "block";
        messageElement.style.color =
            type === "success" ? "green" : "red";
    } else {
        alert(message);
    }
}

// =====================================
// Register
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("name")?.value.trim();
            const email = document.getElementById("email")?.value.trim().toLowerCase();
            const password = document.getElementById("password")?.value;
            const confirmPassword = document.getElementById("confirmPassword")?.value;

            const surgeryType = document.getElementById("surgeryType")?.value || "";
            const surgeryDate = document.getElementById("surgeryDate")?.value || "";

            if (!name || !email || !password || !confirmPassword) {
                showMessage("Please fill in all required fields.");
                return;
            }

            if (password.length < 8) {
                showMessage("Password must be at least 8 characters.");
                return;
            }

            if (password !== confirmPassword) {
                showMessage("Passwords do not match.");
                return;
            }

            const users = getUsers();

            const existingUser = users.find(user => user.email === email);

            if (existingUser) {
                showMessage("This email is already registered.");
                return;
            }

            const newUser = {
                name: name,
                email: email,
                password: password,
                surgery_type: surgeryType,
                surgery_date: surgeryDate
            };

            users.push(newUser);
            saveUsers(users);

            showMessage("Account created successfully!", "success");

            setTimeout(function () {
                window.location.href = "login.html";
            }, 1000);
        });
    }

    // =====================================
    // Login
    // =====================================

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("email")?.value.trim().toLowerCase();
            const password = document.getElementById("password")?.value;

            if (!email || !password) {
                showMessage("Please enter your email and password.");
                return;
            }

            const users = getUsers();

            const user = users.find(function (savedUser) {
                return savedUser.email === email &&
                       savedUser.password === password;
            });

            if (!user) {
                showMessage("Incorrect email or password.");
                return;
            }

            // Save demo login information
            localStorage.setItem("authToken", "demo-token");
            localStorage.setItem("demoLoggedIn", "true");
            localStorage.setItem("currentUser", JSON.stringify(user));

            showMessage("Login successful!", "success");

            setTimeout(function () {
                window.location.href = "index.html";
            }, 500);
        });
    }

});
