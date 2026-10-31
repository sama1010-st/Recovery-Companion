
// ===============================
// Display Current Date
// ===============================

const dateElement = document.getElementById("todayDate");

if (dateElement) {
    dateElement.textContent = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    });
}

// ===============================
// Mobile Sidebar
// ===============================

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", function () {
        sidebar.classList.toggle("show");
    });
}

// ===============================
// Authentication Check
// ===============================

function checkAuthentication() {
    const token = localStorage.getItem("authToken");

    const publicPages = [
        "login.html",
        "register.html"
    ];

    const currentPage = window.location.pathname
        .split("/")
        .pop();

    if (!token && !publicPages.includes(currentPage)) {
        window.location.href = "login.html";
        return false;
    }

    return true;
}

function displayCurrentUser() {
    const userData = localStorage.getItem("currentUser");

    if (!userData) {
        return;
    }

    try {
        const user = JSON.parse(userData);
        const name = user.name || user.full_name || "User";

        const userNameElement = document.getElementById("userName");
        const profileNameElement = document.getElementById("profileName");
        const userAvatarElement = document.getElementById("userAvatar");

        if (userNameElement) {
            userNameElement.textContent = name;
        }

        if (profileNameElement) {
            profileNameElement.textContent = name;
        }

        if (userAvatarElement) {
            userAvatarElement.textContent = name.charAt(0).toUpperCase();
        }

    } catch (error) {
        console.error("Error reading user data:", error);
    }
}




// ===============================
// Logout
// ===============================

function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");

    window.location.href = "login.html";
}

// ===============================
// Logout Button
// ===============================

const logoutButton = document.getElementById("logoutBtn");

if (logoutButton) {
    logoutButton.addEventListener("click", logout);
}

// ===============================
// Initialize Main Script
// ===============================

document.addEventListener("DOMContentLoaded", function () {
    checkAuthentication();
    displayCurrentUser();
});
