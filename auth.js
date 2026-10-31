const API_URL = "http://127.0.0.1:5000/api/auth";

// =====================================
// LOGIN
// =====================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const message = document.getElementById("message");
        const button = loginForm.querySelector("button");

        message.textContent = "Logging in...";
        message.style.color = "#777";
        button.disabled = true;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed.");
            }

            localStorage.setItem("authToken", data.token);
            localStorage.setItem("currentUser", JSON.stringify(data.user));

            message.textContent = "Login successful! Redirecting...";
            message.style.color = "green";

            setTimeout(function () {
                window.location.href = "index.html";
            }, 1000);

        } catch (error) {
            message.textContent = error.message;
            message.style.color = "red";

        } finally {
            button.disabled = false;
        }
    });
}


// =====================================
// REGISTER
// =====================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const surgeryType = document.getElementById("surgeryType").value;

        // Read surgery date
        const surgeryDateInput = document.getElementById("surgeryDate");
        const surgeryDate = surgeryDateInput
            ? surgeryDateInput.value
            : "";

        const message = document.getElementById("message");
        const button = registerForm.querySelector("button");

        if (!surgeryType) {
            message.textContent = "Please select your surgery type.";
            message.style.color = "red";
            return;
        }

        if (!surgeryDate) {
            message.textContent = "Please select your surgery date.";
            message.style.color = "red";
            return;
        }

        // Prevent future surgery dates
        const today = new Date();
        const localToday = new Date(
            today.getTime() - today.getTimezoneOffset() * 60000
        ).toISOString().split("T")[0];

        if (surgeryDate > localToday) {
            message.textContent = "Surgery date cannot be in the future.";
            message.style.color = "red";
            return;
        }

        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match.";
            message.style.color = "red";
            return;
        }

        if (password.length < 8) {
            message.textContent = "Password must be at least 8 characters.";
            message.style.color = "red";
            return;
        }

        message.textContent = "Creating your account...";
        message.style.color = "#777";
        button.disabled = true;

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    surgery_type: surgeryType,
                    surgery_date: surgeryDate
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed.");
            }

            message.textContent = "Account created successfully! Redirecting...";
            message.style.color = "green";

            registerForm.reset();

            setTimeout(function () {
                window.location.href = "login.html";
            }, 1500);

        } catch (error) {
            message.textContent = error.message;
            message.style.color = "red";

        } finally {
            button.disabled = false;
        }
    });
}