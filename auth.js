// =====================================
// DEMO AUTHENTICATION
// Local browser storage only
// =====================================

// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const message = document.getElementById("message");
        const button = loginForm.querySelector("button");

        button.disabled = true;
        message.textContent = "Logging in...";
        message.style.color = "#777";

        const users = JSON.parse(localStorage.getItem("demoUsers") || "[]");

        const user = users.find(
            u => u.email === email && u.password === password
        );

        if (!user) {
            message.textContent = "Invalid email or password. Please register first.";
            message.style.color = "red";
            button.disabled = false;
            return;
        }

        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem("demoLoggedIn", "true");

        message.textContent = "Login successful! Redirecting...";
        message.style.color = "green";

        setTimeout(() => {
            window.location.href = "index.html";
        }, 800);
    });
}


// =====================================
// REGISTER
// =====================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const surgeryType = document.getElementById("surgeryType").value;
        const surgeryDate = document.getElementById("surgeryDate").value;

        const message = document.getElementById("message");
        const button = registerForm.querySelector("button");

        if (!name || !email || !password || !confirmPassword || !surgeryType || !surgeryDate) {
            message.textContent = "Please fill in all fields.";
            message.style.color = "red";
            return;
        }

        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            message.textContent = "Please enter a valid email.";
            message.style.color = "red";
            return;
        }

        if (password.length < 8) {
            message.textContent = "Password must be at least 8 characters.";
            message.style.color = "red";
            return;
        }

        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match.";
            message.style.color = "red";
            return;
        }

        const today = new Date();
        const localToday = new Date(
            today.getTime() - today.getTimezoneOffset() * 60000
        ).toISOString().split("T")[0];

        if (surgeryDate > localToday) {
            message.textContent = "Surgery date cannot be in the future.";
            message.style.color = "red";
            return;
        }

        button.disabled = true;

        const users = JSON.parse(localStorage.getItem("demoUsers") || "[]");

        if (users.some(u => u.email === email)) {
            message.textContent = "This email is already registered.";
            message.style.color = "red";
            button.disabled = false;
            return;
        }

        const newUser = {
            name,
            email,
            password,
            surgery_type: surgeryType,
            surgery_date: surgeryDate
        };

        users.push(newUser);

        localStorage.setItem("demoUsers", JSON.stringify(users));

        message.textContent = "Account created successfully! Redirecting...";
        message.style.color = "green";

        registerForm.reset();

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
    });
}
