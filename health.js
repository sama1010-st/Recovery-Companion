// =====================================
// Recovery Companion
// Daily Health Check-in
// Arabic / English Support
// =====================================

const HEALTH_API = "http://127.0.0.1:5000/api/health/checkin";


// =====================================
// Language
// =====================================

const healthTranslations = {

    en: {
        loginFirst: "Please login first.",
        requestFailed: "Request failed",
        completeQuestions: "Please complete all required questions.",
        saving: "Saving...",
        saveSuccess: "Your daily check-in has been saved successfully! 💗",
        saveError: "Could not save your check-in:",
        noRecords: "No health check recorded yet.",
        loadError: "Unable to load your latest health check.",
        dateUnavailable: "Date unavailable",
        recorded: "Recorded:",
        pain: "Pain Level",
        wound: "Wound Condition",
        swelling: "Arm Swelling",
        fatigue: "Fatigue Level",
        notes: "Additional Notes",
        noNotes: "No additional notes",
        normal: "Looks normal",
        redness: "Redness or increasing warmth",
        discharge: "Unusual discharge",
        opening: "Wound opening",
        fever: "Fever",
        yes: "Yes",
        no: "No",
        woundWarning: "You reported a wound concern or fever. Contact your medical team promptly for advice.",
        swellingWarning: "You reported arm swelling. Please contact your medical team for assessment.",
        saveButton: "Save Daily Check-in"
    },

    ar: {
        loginFirst: "يرجى تسجيل الدخول أولاً.",
        requestFailed: "فشل الطلب",
        completeQuestions: "يرجى الإجابة عن جميع الأسئلة المطلوبة.",
        saving: "جارٍ الحفظ...",
        saveSuccess: "تم حفظ المتابعة اليومية بنجاح! 💗",
        saveError: "تعذر حفظ المتابعة:",
        noRecords: "لم يتم تسجيل أي متابعة صحية حتى الآن.",
        loadError: "تعذر تحميل آخر تقييم صحي.",
        dateUnavailable: "التاريخ غير متاح",
        recorded: "تاريخ التسجيل:",
        pain: "مستوى الألم",
        wound: "حالة الجرح",
        swelling: "تورم الذراع",
        fatigue: "مستوى الإرهاق",
        notes: "ملاحظات إضافية",
        noNotes: "لا توجد ملاحظات إضافية",
        normal: "يبدو طبيعيًا",
        redness: "احمرار أو زيادة السخونة",
        discharge: "إفرازات غير طبيعية",
        opening: "انفتاح الجرح",
        fever: "ارتفاع درجة الحرارة",
        yes: "نعم",
        no: "لا",
        woundWarning: "تم تسجيل مشكلة في الجرح أو ارتفاع درجة الحرارة. يرجى التواصل مع الفريق الطبي سريعًا للحصول على المشورة.",
        swellingWarning: "تم تسجيل وجود تورم في الذراع. يرجى التواصل مع الفريق الطبي لتقييم الحالة.",
        saveButton: "حفظ المتابعة اليومية"
    }
};


function getHealthLanguage() {

    if (typeof window.getCurrentLanguage === "function") {
        return window.getCurrentLanguage() === "ar" ? "ar" : "en";
    }

    try {

        const settings = JSON.parse(
            localStorage.getItem("recoveryAppSettings") || "{}"
        );

        const language =
            localStorage.getItem("app_language") ||
            settings.app_language ||
            settings.language ||
            "en";

        return language === "ar" ? "ar" : "en";

    } catch (error) {
        return "en";
    }
}


function healthText(key) {

    const language = getHealthLanguage();

    return healthTranslations[language][key] ||
           healthTranslations.en[key] ||
           key;
}


function translateHealthValue(value) {

    const language = getHealthLanguage();

    const values = {
        normal: "normal",
        redness: "redness",
        discharge: "discharge",
        opening: "opening",
        fever: "fever",
        yes: "yes",
        no: "no"
    };

    if (!values[value]) return value || "-";

    return healthText(values[value]);
}


// =====================================
// API Request
// =====================================

async function healthRequest(method = "GET", data = null) {

    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error(healthText("loginFirst"));
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

    const response = await fetch(HEALTH_API, options);

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
                result.message || result.error || healthText("requestFailed")
            }`
        );
    }

    return result;
}


// =====================================
// Update Range Values
// =====================================

function setupRangeInputs() {

    const painInput = document.getElementById("painLevel");
    const fatigueInput = document.getElementById("fatigueLevel");

    const painValue = document.getElementById("painValue");
    const fatigueValue = document.getElementById("fatigueValue");

    if (painInput && painValue) {

        painInput.addEventListener("input", function () {

            painValue.textContent = `${painInput.value} / 10`;

        });
    }

    if (fatigueInput && fatigueValue) {

        fatigueInput.addEventListener("input", function () {

            fatigueValue.textContent = `${fatigueInput.value} / 10`;

        });
    }
}


// =====================================
// Update Save Button
// =====================================

function updateSaveButton() {

    const button = document.querySelector(
        '#healthForm button[type="submit"]'
    );

    if (!button || button.disabled) return;

    button.innerHTML = `
        <i class="fa-solid fa-floppy-disk"></i>
        <span>${healthText("saveButton")}</span>
    `;
}


// =====================================
// Save Daily Check-in
// =====================================

async function saveHealthCheck(event) {

    event.preventDefault();

    const form = document.getElementById("healthForm");

    if (!form) return;

    const button = form.querySelector('button[type="submit"]');

    const pain = document.getElementById("painLevel").value;
    const wound = document.getElementById("woundCondition").value;
    const swelling = document.getElementById("armSwelling").value;
    const fatigue = document.getElementById("fatigueLevel").value;
    const notes = document.getElementById("healthNotes").value.trim();

    if (!wound || !swelling) {

        alert(healthText("completeQuestions"));

        return;
    }

    const checkinData = {
        pain: Number(pain),
        wound: wound,
        swelling: swelling,
        fatigue: Number(fatigue),
        notes: notes
    };

    try {

        button.disabled = true;

        button.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span>${healthText("saving")}</span>
        `;

        await healthRequest("POST", checkinData);

        alert(healthText("saveSuccess"));

        form.reset();

        document.getElementById("painValue").textContent = "3 / 10";
        document.getElementById("fatigueValue").textContent = "3 / 10";

        await loadLatestHealthCheck();

        showHealthAlert(checkinData);

    } catch (error) {

        console.error("Save check-in error:", error);

        alert(
            `${healthText("saveError")}\n${error.message}`
        );

    } finally {

        button.disabled = false;

        updateSaveButton();
    }
}


// =====================================
// Load Latest Health Check
// =====================================

async function loadLatestHealthCheck() {

    const container = document.getElementById("lastHealthCheck");

    if (!container) return;

    try {

        const checkins = await healthRequest("GET");

        if (!Array.isArray(checkins) || checkins.length === 0) {

            container.textContent = healthText("noRecords");

            return;
        }

        const latest = checkins[0];

        displayLatestHealthCheck(latest);

    } catch (error) {

        console.error("Load health check error:", error);

        container.textContent = healthText("loadError");
    }
}


// =====================================
// Display Latest Assessment
// =====================================

function displayLatestHealthCheck(checkin) {

    const container = document.getElementById("lastHealthCheck");

    if (!container) return;

    const language = getHealthLanguage();

    const date = checkin.created_at
        ? new Date(checkin.created_at).toLocaleString(
            language === "ar" ? "ar-EG" : "en-US"
        )
        : healthText("dateUnavailable");

    container.replaceChildren();

    const dateElement = document.createElement("p");

    dateElement.textContent =
        `${healthText("recorded")} ${date}`;

    container.appendChild(dateElement);


    const details = [

        [healthText("pain"), `${checkin.pain} / 10`],

        [
            healthText("wound"),
            translateHealthValue(checkin.wound)
        ],

        [
            healthText("swelling"),
            translateHealthValue(checkin.swelling)
        ],

        [healthText("fatigue"), `${checkin.fatigue} / 10`],

        [
            healthText("notes"),
            checkin.notes || healthText("noNotes")
        ]

    ];


    details.forEach(function (item) {

        const paragraph = document.createElement("p");

        const strong = document.createElement("strong");

        strong.textContent = item[0] + ": ";

        paragraph.appendChild(strong);

        paragraph.appendChild(
            document.createTextNode(String(item[1]))
        );

        container.appendChild(paragraph);

    });
}


// =====================================
// Health Warning
// =====================================

function showHealthAlert(data) {

    const alertBox = document.getElementById("healthAlert");

    if (!alertBox) return;

    const warnings = [];

    if (
        data.wound === "redness" ||
        data.wound === "discharge" ||
        data.wound === "opening" ||
        data.wound === "fever"
    ) {

        warnings.push(healthText("woundWarning"));

    }

    if (data.swelling === "yes") {

        warnings.push(healthText("swellingWarning"));

    }


    if (warnings.length > 0) {

        alertBox.hidden = false;

        alertBox.replaceChildren();

        warnings.forEach(function (warning) {

            const paragraph = document.createElement("p");

            paragraph.textContent = warning;

            alertBox.appendChild(paragraph);

        });

    } else {

        alertBox.hidden = true;

        alertBox.replaceChildren();

    }
}


// =====================================
// Refresh Dynamic Content on Language Change
// =====================================

function refreshHealthLanguage() {

    updateSaveButton();

    // Re-render the latest assessment in the selected language.
    if (window.lastHealthCheckData) {
        displayLatestHealthCheck(window.lastHealthCheckData);
    }

}


// =====================================
// Initialize Page
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    setupRangeInputs();

    const form = document.getElementById("healthForm");

    if (form) {

        form.addEventListener("submit", saveHealthCheck);

    }

    updateSaveButton();

    loadLatestHealthCheck();

});


// =====================================
// Language Change Events
// =====================================

window.addEventListener("globalLanguageChanged", function () {

    refreshHealthLanguage();

    loadLatestHealthCheck();

});


window.addEventListener("appSettingsChanged", function () {

    refreshHealthLanguage();

    loadLatestHealthCheck();

});


window.addEventListener("storage", function (event) {

    if (
        event.key === "app_language" ||
        event.key === "recoveryAppSettings"
    ) {

        refreshHealthLanguage();

        loadLatestHealthCheck();

    }

});



