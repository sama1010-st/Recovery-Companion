// =====================================
// Recovery Companion - Settings
// =====================================

const SETTINGS_KEY = "recoveryAppSettings";
const LANGUAGE_KEY = "app_language";

const userName = document.getElementById("userName");
const languageSelect = document.getElementById("languageSelect");
const voiceToggle = document.getElementById("voiceToggle");
const reminderToggle = document.getElementById("reminderToggle");

const saveButton = document.getElementById("saveSettings");
const clearButton = document.getElementById("clearData");
const settingsMessage = document.getElementById("settingsMessage");


// =====================================
// Load Saved Settings
// =====================================

function loadSettings() {
    try {
        const savedSettings = JSON.parse(
            localStorage.getItem(SETTINGS_KEY)
        ) || {};

        const savedLanguage =
            localStorage.getItem(LANGUAGE_KEY) ||
            savedSettings.language ||
            "en";

        userName.value = savedSettings.name || "";

        languageSelect.value = savedLanguage;

        voiceToggle.checked =
            savedSettings.voiceEnabled !== false;

        reminderToggle.checked =
            savedSettings.remindersEnabled !== false;

    } catch (error) {
        console.error("Could not load settings:", error);
    }
}


// =====================================
// Save Settings
// =====================================

function saveSettings() {

    const settings = {
        name: userName.value.trim(),
        language: languageSelect.value,
        voiceEnabled: voiceToggle.checked,
        remindersEnabled: reminderToggle.checked
    };

    // Save all settings
    localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(settings)
    );

    // Save language separately for all pages
    localStorage.setItem(
        LANGUAGE_KEY,
        settings.language
    );

    // Save voice preference
    localStorage.setItem(
        "voice_enabled",
        settings.voiceEnabled ? "true" : "false"
    );

    // Notify other scripts that settings changed
    window.dispatchEvent(
        new CustomEvent("appSettingsChanged", {
            detail: settings
        })
    );

    showMessage("Settings saved successfully!");
}


// =====================================
// Show Message
// =====================================

function showMessage(message) {

    settingsMessage.textContent = message;
    settingsMessage.style.color = "#D45B96";

    setTimeout(() => {
        settingsMessage.textContent = "";
    }, 3000);
}


// =====================================
// Clear Saved Data
// =====================================

function clearAllData() {

    const confirmed = confirm(
        "Are you sure? This will delete your saved check-ins, medications, and settings."
    );

    if (!confirmed) return;

    localStorage.removeItem("recoveryHealthChecks");
    localStorage.removeItem("recoveryMedications");
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(LANGUAGE_KEY);
    localStorage.removeItem("voice_enabled");

    userName.value = "";
    languageSelect.value = "en";

    voiceToggle.checked = true;
    reminderToggle.checked = true;

    showMessage("Saved application data cleared.");

    window.dispatchEvent(
        new CustomEvent("appSettingsChanged", {
            detail: {
                language: "en",
                voiceEnabled: true,
                remindersEnabled: true
            }
        })
    );
}


// =====================================
// Event Listeners
// =====================================

saveButton.addEventListener("click", saveSettings);

clearButton.addEventListener("click", clearAllData);


// =====================================
// Initialize
// =====================================

loadSettings();

console.log("Settings page loaded successfully.");