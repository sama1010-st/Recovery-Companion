// =====================================
// Recovery Companion - Progress Page
// =====================================

const PROGRESS_API = "http://127.0.0.1:5000/api/health/checkin";

document.addEventListener("DOMContentLoaded", function () {
    loadProgressData();
});


// =====================================
// Load Data From Backend
// =====================================

async function loadProgressData() {

    const token = localStorage.getItem("authToken");

    if (!token) {
        showProgressError("Please log in first.");
        return;
    }

    try {

        const response = await fetch(PROGRESS_API, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Failed to load health records.");
        }

        const checkins = await response.json();

        if (!Array.isArray(checkins)) {
            throw new Error("Invalid data received.");
        }

        updateStatistics(checkins);
        displayProgressChart(checkins);
        displayProgressHistory(checkins);

    } catch (error) {

        console.error("Progress Error:", error);

        showProgressError(error.message);
    }
}


// =====================================
// Update Statistics
// =====================================

function updateStatistics(checkins) {

    const totalElement = document.getElementById("totalChecks");
    const painElement = document.getElementById("averagePain");
    const fatigueElement = document.getElementById("averageFatigue");
    const dateElement = document.getElementById("latestDate");

    if (totalElement) {
        totalElement.textContent = checkins.length;
    }

    if (checkins.length === 0) {

        if (painElement) painElement.textContent = "--";
        if (fatigueElement) fatigueElement.textContent = "--";
        if (dateElement) dateElement.textContent = "--";

        return;
    }

    const painValues = checkins
        .map(item => item.pain)
        .filter(value => value !== null && value !== undefined && value !== "");

    const fatigueValues = checkins
        .map(item => item.fatigue)
        .filter(value => value !== null && value !== undefined && value !== "");

    const averagePain = calculateAverage(painValues);
    const averageFatigue = calculateAverage(fatigueValues);

    if (painElement) {
        painElement.textContent = averagePain;
    }

    if (fatigueElement) {
        fatigueElement.textContent = averageFatigue;
    }

    if (dateElement) {
        dateElement.textContent = formatDate(checkins[0].created_at);
    }
}


// =====================================
// Calculate Average
// =====================================

function calculateAverage(values) {

    if (values.length === 0) {
        return "--";
    }

    const total = values.reduce(function (sum, value) {
        return sum + Number(value);
    }, 0);

    return (total / values.length).toFixed(1);
}


// =====================================
// Display Chart
// =====================================

function displayProgressChart(checkins) {

    const chart = document.getElementById("progressChart");

    if (!chart) return;

    chart.innerHTML = "";

    if (checkins.length === 0) {

        chart.innerHTML =
            '<p class="chart-empty">Your chart will appear after your first check-in.</p>';

        return;
    }

    const records = checkins.slice(0, 7).reverse();

    records.forEach(function (item) {

        const row = document.createElement("div");
        row.className = "progress-bar-row";

        const date = document.createElement("span");
        date.className = "progress-bar-date";
        date.textContent = formatShortDate(item.created_at);

        const bars = document.createElement("div");
        bars.className = "progress-bars";

        // Pain bar
        const painBar = createProgressBar(
            "Pain",
            item.pain,
            "#E879A5"
        );

        // Fatigue bar
        const fatigueBar = createProgressBar(
            "Fatigue",
            item.fatigue,
            "#8B7CE8"
        );

        bars.appendChild(painBar);
        bars.appendChild(fatigueBar);

        row.appendChild(date);
        row.appendChild(bars);

        chart.appendChild(row);
    });
}


// =====================================
// Create Progress Bar
// =====================================

function createProgressBar(label, value, color) {

    const container = document.createElement("div");
    container.className = "progress-bar-container";

    const title = document.createElement("span");
    title.textContent = label + ": " + (value ?? "--");

    const background = document.createElement("div");
    background.className = "progress-bar-background";

    const bar = document.createElement("div");
    bar.className = "progress-bar-fill";

    const numericValue = Number(value);

    let percentage = 0;

    if (value !== null && value !== undefined && value !== "") {
        percentage = Math.max(0, Math.min(100, numericValue * 10));
    }

    bar.style.width = percentage + "%";
    bar.style.backgroundColor = color;

    background.appendChild(bar);

    container.appendChild(title);
    container.appendChild(background);

    return container;
}


// =====================================
// Display History
// =====================================

function displayProgressHistory(checkins) {

    const history = document.getElementById("progressHistory");

    if (!history) return;

    history.innerHTML = "";

    if (checkins.length === 0) {

        history.innerHTML =
            '<p class="chart-empty">No records available yet.</p>';

        return;
    }

    checkins.forEach(function (item) {

        const card = document.createElement("div");
        card.className = "progress-history-item";

        const title = document.createElement("h4");
        title.textContent = formatDate(item.created_at);

        const pain = document.createElement("p");
        pain.textContent = "Pain: " + (item.pain ?? "--") + "/10";

        const fatigue = document.createElement("p");
        fatigue.textContent = "Fatigue: " + (item.fatigue ?? "--") + "/10";

        const wound = document.createElement("p");
        wound.textContent = "Wound: " + (item.wound || "Not recorded");

        const swelling = document.createElement("p");
        swelling.textContent =
            "Arm swelling: " + (item.swelling || "Not recorded");

        card.appendChild(title);
        card.appendChild(pain);
        card.appendChild(fatigue);
        card.appendChild(wound);
        card.appendChild(swelling);

        if (item.notes) {

            const notes = document.createElement("p");
            notes.textContent = "Notes: " + item.notes;

            card.appendChild(notes);
        }

        history.appendChild(card);
    });
}


// =====================================
// Format Date
// =====================================

function formatDate(dateString) {

    if (!dateString) return "--";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "--";

    return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}


function formatShortDate(dateString) {

    if (!dateString) return "--";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "--";

    return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short"
    });
}


// =====================================
// Show Error
// =====================================

function showProgressError(message) {

    const elements = [
        "totalChecks",
        "averagePain",
        "averageFatigue",
        "latestDate"
    ];

    elements.forEach(function (id) {

        const element = document.getElementById(id);

        if (element) {
            element.textContent = "--";
        }
    });

    const chart = document.getElementById("progressChart");
    const history = document.getElementById("progressHistory");

    if (chart) {
        chart.textContent = message;
    }

    if (history) {
        history.textContent = message;
    }
}
