// =====================================
// Recovery Companion
// Dashboard Data - Arabic / English
// =====================================

// ===============================
// Language Functions
// ===============================

function dashboardLanguage() {
    if (window.getCurrentLanguage) {
        return window.getCurrentLanguage();
    }

    return localStorage.getItem("app_language") || "en";
}

function dashboardIsArabic() {
    return dashboardLanguage() === "ar";
}

function dashboardText(ar, en) {
    return dashboardIsArabic() ? ar : en;
}

// ===============================
// Dashboard Variables
// ===============================

let dashboardMedications = [];
let dashboardCheckinsLoaded = false;

// =====================================
// Initialize Dashboard
// =====================================

document.addEventListener("DOMContentLoaded", function () {
    loadDashboardData();
    loadDashboardCheckin();
});

// =====================================
// Language Change Listener
// =====================================

window.addEventListener("globalLanguageChanged", function () {
    refreshDashboardLanguage();
});

function refreshDashboardLanguage() {
    displayMedicationSummary(dashboardMedications);
    displayMedicationReminders(dashboardMedications);

    if (dashboardCheckinsLoaded) {
        loadDashboardCheckin();
    }
}

// =====================================
// Load Dashboard Medication Data
// =====================================

async function loadDashboardData() {
    const takenElement = document.getElementById("takenMedications");
    const totalElement = document.getElementById("totalMedications");
    const noteElement = document.getElementById("medicationNote");

    const remindersNote = document.getElementById("remindersNote");
    const token = localStorage.getItem("authToken");

    if (!token) {
        if (noteElement) {
            noteElement.textContent = dashboardText(
                "من فضلك سجّلي الدخول أولاً.",
                "Please log in first."
            );
        }

        if (remindersNote) {
            remindersNote.textContent = dashboardText(
                "من فضلك سجّلي الدخول أولاً.",
                "Please log in first."
            );
        }

        return;
    }

    try {
        const response = await fetch(
            "http://127.0.0.1:5000/api/medications/",
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error("Could not load medication data.");
        }

        const medications = await response.json();

        dashboardMedications = Array.isArray(medications)
            ? medications
            : [];

        if (takenElement) {
            takenElement.textContent = dashboardMedications.filter(
                medication => medication.taken === true
            ).length;
        }

        if (totalElement) {
            totalElement.textContent = dashboardMedications.length;
        }

        displayMedicationSummary(dashboardMedications);
        displayMedicationReminders(dashboardMedications);

    } catch (error) {
        console.error("Dashboard medication error:", error);

        if (noteElement) {
            noteElement.textContent = dashboardText(
                "تعذر تحميل بيانات الأدوية.",
                "Unable to load medication data."
            );
        }

        if (remindersNote) {
            remindersNote.textContent = dashboardText(
                "تعذر تحميل التذكيرات.",
                "Unable to load reminders."
            );
        }
    }
}

// =====================================
// Display Medication Summary
// =====================================

function displayMedicationSummary(medications) {
    const noteElement = document.getElementById("medicationNote");

    if (!noteElement) return;

    const total = medications.length;

    const taken = medications.filter(function (medication) {
        return medication.taken === true;
    }).length;

    if (total === 0) {
        noteElement.textContent = dashboardText(
            "لم تتم إضافة أدوية حتى الآن.",
            "No medications added yet."
        );

    } else if (taken === total) {
        noteElement.textContent = dashboardText(
            "تم تسجيل تناول جميع الأدوية.",
            "All medications marked as taken."
        );

    } else {
        const remaining = total - taken;

        noteElement.textContent = dashboardIsArabic()
            ? `متبقي ${remaining} دواء لم يتم تناوله.`
            : `${remaining} medication(s) not taken yet.`;
    }
}

// =====================================
// Load Daily Check-in Status
// =====================================

async function loadDashboardCheckin() {
    const statusElement = document.getElementById("checkinStatus");
    const noteElement = document.getElementById("checkinNote");

    const token = localStorage.getItem("authToken");

    if (!statusElement || !noteElement) return;

    if (!token) {
        statusElement.textContent = dashboardText(
            "لم يتم بعد",
            "Pending"
        );

        noteElement.textContent = dashboardText(
            "من فضلك سجّلي الدخول أولاً.",
            "Please log in first."
        );

        return;
    }

    try {
        const response = await fetch(
            "http://127.0.0.1:5000/api/health/checkin",
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error("Could not load check-in data.");
        }

        const checkins = await response.json();

        dashboardCheckinsLoaded = true;

        if (!Array.isArray(checkins) || checkins.length === 0) {
            showPendingCheckin();
            return;
        }

        const today = getLocalDate(new Date());

        const todayCheckin = checkins.find(function (checkin) {
            if (!checkin.created_at) return false;

            const checkinDate = getLocalDate(
                new Date(checkin.created_at)
            );

            return checkinDate === today;
        });

        if (todayCheckin) {
            statusElement.textContent = dashboardText(
                "مكتمل",
                "Completed"
            );

            noteElement.textContent = dashboardText(
                "تم حفظ التقييم اليومي.",
                "Your daily assessment is saved."
            );

        } else {
            showPendingCheckin();
        }

    } catch (error) {
        console.error("Dashboard check-in error:", error);

        statusElement.textContent = dashboardText(
            "لم يتم بعد",
            "Pending"
        );

        noteElement.textContent = dashboardText(
            "تعذر تحميل حالة التقييم اليومي.",
            "Unable to load check-in status."
        );
    }
}

// =====================================
// Pending Check-in
// =====================================

function showPendingCheckin() {
    const statusElement = document.getElementById("checkinStatus");
    const noteElement = document.getElementById("checkinNote");

    if (statusElement) {
        statusElement.textContent = dashboardText(
            "لم يتم بعد",
            "Pending"
        );
    }

    if (noteElement) {
        noteElement.textContent = dashboardText(
            "لم تسجلي تقييم اليوم حتى الآن.",
            "You haven't checked in today yet."
        );
    }
}

// =====================================
// Get Local Date (YYYY-MM-DD)
// =====================================

function getLocalDate(date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// =====================================
// Display Medication Reminders
// =====================================

function displayMedicationReminders(medications) {
    const remindersList = document.getElementById("remindersList");
    const remindersNote = document.getElementById("remindersNote");

    if (!remindersList) return;

    remindersList.replaceChildren();

    if (medications.length === 0) {
        if (remindersNote) {
            remindersNote.textContent = dashboardText(
                "لا توجد تذكيرات بالأدوية حتى الآن.",
                "No medication reminders yet."
            );
        }

        return;
    }

    const sortedMedications = [...medications].sort(function (a, b) {
        return String(a.time || "").localeCompare(String(b.time || ""));
    });

    sortedMedications.forEach(function (medication) {
        const reminderItem = document.createElement("div");
        reminderItem.className = "reminder-item";

        // Medication Time
        const time = document.createElement("div");
        time.className = "time";
        time.textContent = formatMedicationTime(medication.time);

        // Medication Information
        const info = document.createElement("div");

        const name = document.createElement("h4");
        name.textContent = medication.name || dashboardText(
            "دواء",
            "Medication"
        );

        const dose = document.createElement("p");
        dose.textContent = medication.dose || dashboardText(
            "تذكير بتناول الدواء",
            "Medication reminder"
        );

        info.appendChild(name);
        info.appendChild(dose);

        // Medication Status
        const status = document.createElement("span");
        status.className = "reminder-dot";

        if (medication.taken === true) {
            status.style.backgroundColor = "#55B889";

            status.title = dashboardText(
                "تم تناوله",
                "Taken"
            );

        } else {
            status.title = dashboardText(
                "لم يتم تناوله",
                "Not taken"
            );
        }

        reminderItem.appendChild(time);
        reminderItem.appendChild(info);
        reminderItem.appendChild(status);

        remindersList.appendChild(reminderItem);
    });

    if (remindersNote) {
        remindersNote.textContent = dashboardIsArabic()
            ? `${medications.length} تذكير بالأدوية`
            : `${medications.length} medication reminder(s)`;
    }
}

// =====================================
// Format Medication Time
// =====================================

function formatMedicationTime(time) {
    if (!time) {
        return dashboardText(
            "بدون موعد",
            "No time"
        );
    }

    const parts = String(time).split(":");

    if (parts.length < 2) return time;

    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];

    if (isNaN(hours)) return time;

    if (dashboardIsArabic()) {
        const period = hours >= 12 ? "م" : "ص";

        hours = hours % 12 || 12;

        return `${String(hours).padStart(2, "0")}:${minutes} ${period}`;
    }

    const period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return `${String(hours).padStart(2, "0")}:${minutes} ${period}`;
}



