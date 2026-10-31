// =====================================
// Recovery Companion
// Medication Reminders
// =====================================

const API_URL = "http://127.0.0.1:5000/api/medications/";


// =====================================
// API Request
// =====================================

async function medicationRequest(url, method = "GET", data = null) {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("You are not logged in. Please login again.");
    }

    const options = {
        method: method,
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };

    if (data !== null) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    const responseText = await response.text();

    let result;

    try {
        result = JSON.parse(responseText);
    } catch {
        result = { message: responseText };
    }

    if (!response.ok) {
        throw new Error(
            `Status: ${response.status} - ${
                result.message ||
                result.error ||
                result.msg ||
                responseText ||
                "Unknown error"
            }`
        );
    }

    return result;
}


// =====================================
// Load Medications
// =====================================

async function loadMedications() {
    try {
        const medications = await medicationRequest(API_URL);

        if (!Array.isArray(medications)) {
            throw new Error("Invalid medications response from server.");
        }

        displayMedications(medications);

    } catch (error) {
        console.error("Load medications error:", error);

        const list = document.getElementById("medicationList");

        if (list) {
            list.textContent = "Unable to load medications.";
        }

        alert("Could not load medications: " + error.message);
    }
}


// =====================================
// Display Medications
// =====================================

function displayMedications(medications) {
    const list = document.getElementById("medicationList");
    const count = document.getElementById("medicationCount");

    if (!list) return;

    list.replaceChildren();

    if (count) {
        count.textContent = `${medications.length} medications`;
    }

    if (medications.length === 0) {
        list.textContent = "No medications added yet.";
        return;
    }

    medications.forEach(function (med) {

        const card = document.createElement("div");
        card.className = "medication-card";

        const name = document.createElement("h3");
        name.textContent = med.name;

        const dose = document.createElement("p");
        dose.textContent = "Dose: " + med.dose;

        const time = document.createElement("p");
        time.textContent = "Time: " + med.time;

        const notes = document.createElement("p");
        notes.textContent = med.notes || "";

        const status = document.createElement("p");
        status.textContent = med.taken ? "Taken" : "Not taken";

        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.textContent = med.taken
            ? "Mark as Not Taken"
            : "Mark as Taken";

        toggle.dataset.action = "toggle";
        toggle.dataset.id = med.id;
        toggle.dataset.taken = String(med.taken);

        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "Delete";

        remove.dataset.action = "delete";
        remove.dataset.id = med.id;

        card.append(
            name,
            dose,
            time,
            notes,
            status,
            toggle,
            remove
        );

        list.appendChild(card);
    });
}


// =====================================
// Add Medication
// =====================================

async function addMedication(event) {
    event.preventDefault();

    const name = document.getElementById("medName").value.trim();
    const dose = document.getElementById("medDose").value.trim();
    const time = document.getElementById("medTime").value;
    const notes = document.getElementById("medNotes").value.trim();

    if (!name || !dose || !time) {
        alert("Please fill in all required fields.");
        return;
    }

    const submitButton = event.submitter;

    try {

        if (submitButton) {
            submitButton.disabled = true;
        }

        const result = await medicationRequest(API_URL, "POST", {
            name: name,
            dose: dose,
            time: time,
            notes: notes
        });

        alert("Medication added successfully!");

        document.getElementById("medicationForm").reset();

        await loadMedications();

    } catch (error) {

        console.error("Add medication error:", error);

        alert("Could not save medication:\n" + error.message);

    } finally {

        if (submitButton) {
            submitButton.disabled = false;
        }
    }
}


// =====================================
// Toggle Medication Status
// =====================================

async function toggleMedication(id, taken) {
    try {

        await medicationRequest(
            API_URL + id,
            "PATCH",
            { taken: !taken }
        );

        await loadMedications();

    } catch (error) {

        console.error("Toggle medication error:", error);

        alert("Could not update medication:\n" + error.message);
    }
}


// =====================================
// Delete Medication
// =====================================

async function deleteMedication(id) {

    if (!confirm("Are you sure you want to delete this medication?")) {
        return;
    }

    try {

        await medicationRequest(
            API_URL + id,
            "DELETE"
        );

        alert("Medication deleted successfully!");

        await loadMedications();

    } catch (error) {

        console.error("Delete medication error:", error);

        alert("Could not delete medication:\n" + error.message);
    }
}


// =====================================
// Initialize Page
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("medicationForm");

    if (form) {
        form.addEventListener("submit", addMedication);
    }

    const list = document.getElementById("medicationList");

    if (list) {

        list.addEventListener("click", function (event) {

            const button = event.target.closest("button");

            if (!button) return;

            const id = button.dataset.id;

            if (button.dataset.action === "toggle") {

                toggleMedication(
                    id,
                    button.dataset.taken === "true"
                );
            }

            if (button.dataset.action === "delete") {
                deleteMedication(id);
            }
        });
    }

    loadMedications();
});
