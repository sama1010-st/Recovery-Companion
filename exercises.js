import {
    PoseLandmarker,
    HandLandmarker,
    FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs";

/* ==========================================
   SETTINGS & LANGUAGE
========================================== */

const SETTINGS_KEY = "recoveryAppSettings";
const LANGUAGE_KEY = "app_language";

function getAppSettings() {
    try {
        return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
    } catch {
        return {};
    }
}

function getAppLanguage() {
    const settings = getAppSettings();

    const language =
        localStorage.getItem(LANGUAGE_KEY) ||
        settings.language ||
        settings.app_language ||
        "en";

    return language === "ar" ? "ar" : "en";
}

function isArabic() {
    return currentLanguage === "ar";
}

function getText(ar, en) {
    return isArabic() ? ar : en;
}

function getVoiceSetting() {
    const settings = getAppSettings();

    const value =
        settings.voiceEnabled ??
        settings.voice_enabled ??
        localStorage.getItem("voice_enabled");

    if (value === false || value === "false") {
        return false;
    }

    return true;
}

let currentLanguage = getAppLanguage();
let voiceEnabled = getVoiceSetting();

/* ==========================================
   TRANSLATIONS
========================================== */

const translations = {
    backDashboard: ["العودة إلى الرئيسية", "Back to Dashboard"],
    pageTitle: ["مدرب التمارين بالذكاء الاصطناعي", "AI Exercise Coach"],
    pageSubtitle: ["تتبع ذكي للحركة لدعم التعافي.", "Smart movement tracking for recovery support."],

    journeyTitle: ["رحلة تعافيك", "Your Recovery Journey"],
    journeySubtitle: ["معلومات التعافي والملخص الأسبوعي.", "Your recovery information and weekly overview."],
    surgeryType: ["نوع الجراحة", "Surgery Type"],
    daysSince: ["الأيام منذ الجراحة", "Days Since Surgery"],
    recoveryWeek: ["أسبوع التعافي", "Recovery Week"],
    weeklyOverview: ["ملخص التعافي الأسبوعي", "Weekly Recovery Overview"],
    loadingRecovery: ["جارٍ تحميل معلومات التعافي...", "Loading your recovery information..."],

    recoveryMedicalNote: [
        "رحلة التعافي تختلف من شخص لآخر. اتبعي دائمًا تعليمات الطبيب والفريق الطبي قبل بدء التمارين أو تغييرها.",
        "Your recovery journey is individual. Always follow your surgeon's and healthcare team's instructions before starting or changing exercises."
    ],

    exerciseLibrary: ["مكتبة التمارين", "Exercise Library"],
    selectExercise: ["اختاري تمرينًا لعرض تفاصيله.", "Select an exercise to view its information."],

    shoulderRolls: ["لف الكتفين", "Shoulder Rolls"],
    shoulderBlade: ["ضم لوحي الكتف", "Shoulder Blade Squeezes"],
    elbowBends: ["ثني المرفق", "Elbow Bends"],
    handOpeningClosing: ["فتح وإغلاق اليد", "Hand Opening and Closing"],
    armLifts: ["رفع الذراعين بلطف", "Gentle Arm Lifts"],

    listenInstructions: ["استمعي إلى التعليمات", "Listen to Instructions"],

    exerciseNote: [
        "هذه أمثلة تعليمية للتمارين. اتبعي تعليمات الفريق الطبي، ولا تمارسي أي تمرين إلا بعد الموافقة عليه لمرحلة التعافي الخاصة بك.",
        "These are educational exercise examples. Always follow your medical team's instructions. Do not perform an exercise unless it has been approved for your recovery stage."
    ],

    aiCoach: ["مدرب التمارين الذكي", "AI Exercise Coach"],
    cameraIntro: [
        "اتبعي عرض التمرين بينما تتتبع الكاميرا حركة الجزء العلوي من جسمك.",
        "Follow the exercise demonstration while the camera tracks your upper-body movement."
    ],

    liveCamera: ["تتبع الكاميرا المباشر", "Live Camera Tracking"],
    cameraNotRunning: ["الكاميرا غير قيد التشغيل", "Camera is not running"],
    exerciseDemo: ["عرض التمرين", "Exercise Demonstration"],
    startCamera: ["تشغيل الكاميرا", "Start Camera"],
    stopCamera: ["إيقاف الكاميرا", "Stop Camera"],

    voiceOn: ["الصوت يعمل", "Voice ON"],
    voiceOff: ["الصوت متوقف", "Voice OFF"],
    voiceEnabled: ["الإرشاد الصوتي مفعل.", "Voice guidance is enabled."],
    voiceDisabled: ["الإرشاد الصوتي متوقف.", "Voice guidance is disabled."],

    movementInfo: ["معلومات الحركة", "Movement Information"],
    position: ["الوضعية:", "Position:"],
    bodyDetection: ["اكتشاف الجسم:", "Body Detection:"],
    armAngleLabel: ["زاوية الذراع", "Arm Angle"],
    repetitionsLabel: ["عدد التكرارات", "Repetitions"],
    sessionStatusLabel: ["حالة الجلسة", "Session Status"],

    aiMedicalNote: [
        "قياسات الحركة بالذكاء الاصطناعي تجريبية وليست تقييمًا طبيًا أو نطاقًا محددًا للتمرين.",
        "AI movement measurements are experimental and are not a medical assessment or a prescribed exercise range."
    ],

    watchVideo: ["شاهدي فيديو التمرين", "Watch Exercise Video"],

    cameraStarted: ["الكاميرا تعمل الآن.", "Camera is running."],
    cameraStopped: ["تم إيقاف الكاميرا.", "Camera stopped."],
    cameraError: [
        "تعذر تشغيل الكاميرا. تأكدي من السماح باستخدامها.",
        "Unable to start camera. Please allow camera access."
    ],

    modelLoading: ["جارٍ تحميل نموذج الذكاء الاصطناعي...", "Loading AI model..."],
    modelReady: ["نموذج الذكاء الاصطناعي جاهز.", "AI model is ready."],
    modelError: ["حدث خطأ أثناء تحميل النموذج.", "Error loading AI model."],

    waitingBody: ["في انتظار اكتشاف الجسم...", "Waiting for body detection..."],
    bodyDetected: ["تم اكتشاف الجسم.", "Body detected."],
    bodyNotDetected: ["لم يتم اكتشاف الجسم. تحركي قليلًا للخلف.", "Body not detected. Move slightly backward."],

    correctPosition: ["وضعيتك جيدة.", "Your position is good."],
    adjustPosition: ["عدلي وضعيتك أمام الكاميرا.", "Please adjust your position."],

    sessionNotStarted: ["لم تبدأ", "Not Started"],
    sessionRunning: ["جارية", "Running"],
    noAngle: ["غير متاح", "Unavailable"],

    notSpecified: ["غير محدد", "Not specified"],
    surgeryDateMissing: ["لم يتم إدخال تاريخ الجراحة بعد.", "Surgery date has not been entered yet."],

    demoCaption: [
        "اتبعي الحركة الموضحة في الصورة.",
        "Follow the movement shown in the demonstration."
    ],

    followExercise: [
        "اتبعي الحركة الموضحة أمامك.",
        "Follow the exercise demonstration."
    ],

    goodJob: ["أحسنتِ!", "Great job!"],
    repetitionsCount: ["تكرارات", "repetitions"]
};

function translateStaticContent() {
    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.dataset.i18n;
        const value = translations[key];

        if (!value) return;

        const translated = isArabic() ? value[0] : value[1];

        element.textContent = translated;
    });

    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = isArabic() ? "rtl" : "ltr";

    document.body.classList.toggle(
        "arabic-language",
        isArabic()
    );
}

/* ==========================================
   DOM ELEMENTS
========================================== */

const camera = document.getElementById("camera");
const poseCanvas = document.getElementById("poseCanvas");
const ctx = poseCanvas?.getContext("2d");

const cameraPlaceholder = document.getElementById("cameraPlaceholder");

const startCameraButton = document.getElementById("startCamera");
const stopCameraButton = document.getElementById("stopCamera");

const statusElement = document.getElementById("status");
const messageElement = document.getElementById("message");

const positionStatus = document.getElementById("positionStatus");
const bodyStatus = document.getElementById("bodyStatus");

const armAngleElement = document.getElementById("armAngle");
const repetitionsElement = document.getElementById("repetitions");
const sessionStatusElement = document.getElementById("sessionStatus");

const exerciseSelect = document.getElementById("exerciseSelect");
const exerciseTitle = document.getElementById("exerciseTitle");
const exerciseImage = document.getElementById("exerciseImage");
const exerciseDescription = document.getElementById("exerciseDescription");
const exerciseSteps = document.getElementById("exerciseSteps");

const exerciseDemoImage = document.getElementById("exerciseDemoImage");
const demoCaption = document.getElementById("demoCaption");

const exerciseVideoLink = document.getElementById("exerciseVideoLink");
const demoVideoLink = document.getElementById("demoVideoLink");

const exerciseVoiceButton = document.getElementById("exerciseVoiceButton");
const voiceToggle = document.getElementById("voiceToggle");
const voiceStatus = document.getElementById("voiceStatus");

/* ==========================================
   EXERCISES
========================================== */

const exercises = {

    "shoulder-rolls": {
        title: ["لف الكتفين", "Shoulder Rolls"],
        image: "images/shoulder-rolls.gif",
        video: "https://www.youtube.com/results?search_query=shoulder+rolls+exercise+breast+cancer+recovery",

        description: [
            "حركي كتفيك ببطء في حركات دائرية لطيفة.",
            "Slowly move your shoulders in gentle circular movements."
        ],

        steps: [
            ["اجلسي أو قفي بشكل مستقيم.", "Sit or stand upright."],
            ["ارفعي كتفيك برفق.", "Gently raise your shoulders."],
            ["حركي كتفيك للخلف ثم للأسفل.", "Roll your shoulders backward and down."],
            ["كرري الحركة ببطء إذا كانت مريحة.", "Repeat slowly if comfortable."]
        ],

        voice: [
            "ابدئي بالوقوف أو الجلوس بشكل مستقيم. ارفعي كتفيك برفق ثم حركيهما للخلف وللأسفل.",
            "Start by sitting or standing upright. Gently raise your shoulders, then roll them backward and down."
        ]
    },

    "shoulder-blade": {
        title: ["ضم لوحي الكتف", "Shoulder Blade Squeezes"],
        image: "images/shoulder-blade.gif",
        video: "https://www.youtube.com/results?search_query=shoulder+blade+squeezes+breast+cancer+recovery",

        description: [
            "يساعد هذا التمرين على تحريك لوحي الكتف بلطف.",
            "This exercise gently moves the shoulder blades."
        ],

        steps: [
            ["اجلسي بشكل مستقيم.", "Sit upright."],
            ["اجعلي ذراعيك بجانب جسمك.", "Keep your arms by your sides."],
            ["قربي لوحي الكتف من بعضهما برفق.", "Gently bring your shoulder blades together."],
            ["استرخي وكرري إذا كان ذلك مريحًا.", "Relax and repeat if comfortable."]
        ],

        voice: [
            "اجلسي بشكل مستقيم. قربي لوحي الكتف من بعضهما برفق ثم استرخي.",
            "Sit upright. Gently bring your shoulder blades together, then relax."
        ]
    },

    "elbow-bends": {
        title: ["ثني المرفق", "Elbow Bends"],
        image: "images/elbow-bends.gif",
        video: "https://www.youtube.com/results?search_query=elbow+bends+after+breast+cancer+surgery",

        description: [
            "حركي المرفق ببطء لثني الذراع وفردها.",
            "Slowly bend and straighten your elbow."
        ],

        steps: [
            ["اجلسي في وضع مريح.", "Sit in a comfortable position."],
            ["اجعلي ذراعك بجانب جسمك.", "Keep your arm by your side."],
            ["اثني المرفق ببطء.", "Slowly bend your elbow."],
            ["افردي الذراع برفق.", "Gently straighten your arm."]
        ],

        voice: [
            "اجعلي ذراعك بجانب جسمك. اثني المرفق ببطء ثم افردي الذراع برفق.",
            "Keep your arm by your side. Slowly bend your elbow, then gently straighten your arm."
        ]
    },

    "hand-movements": {
        title: ["فتح وإغلاق اليد", "Hand Opening and Closing"],
        image: "images/hand-movements.gif",
        video: "https://www.youtube.com/results?search_query=hand+opening+closing+exercise+breast+cancer+recovery",

        description: [
            "افتحي يدك واغلقيها ببطء لتحريك الأصابع.",
            "Slowly open and close your hand to move your fingers."
        ],

        steps: [
            ["اجلسي بشكل مريح.", "Sit comfortably."],
            ["افتحي أصابعك برفق.", "Gently spread your fingers."],
            ["أغلقي يدك ببطء.", "Slowly close your hand."],
            ["كرري الحركة دون ضغط.", "Repeat without forcing the movement."]
        ],

        voice: [
            "افتحي أصابعك برفق ثم أغلقي يدك ببطء. لا تضغطي على يدك.",
            "Gently spread your fingers, then slowly close your hand. Do not force the movement."
        ]
    },

    "arm-lifts": {
        title: ["رفع الذراعين بلطف", "Gentle Arm Lifts"],
        image: "images/arm-lifts.gif",
        video: "https://www.youtube.com/results?search_query=gentle+arm+lifts+after+breast+cancer+surgery",

        description: [
            "ارفعي ذراعك ببطء إلى مدى حركة مريح ومسموح به طبيًا.",
            "Slowly raise your arm within a comfortable and medically approved range."
        ],

        steps: [
            ["اجلسي أو قفي بشكل مريح.", "Sit or stand comfortably."],
            ["ارفعي ذراعك ببطء.", "Slowly raise your arm."],
            ["توقفي عند الحد المريح والمسموح به.", "Stop within your comfortable and approved range."],
            ["اخفضي ذراعك ببطء.", "Slowly lower your arm."]
        ],

        voice: [
            "ارفعي ذراعك ببطء إلى المدى المريح والمسموح به من الطبيب. ثم اخفضيها برفق.",
            "Slowly raise your arm within your comfortable and medically approved range. Then gently lower it."
        ]
    }
};

/* ==========================================
   VOICE SYSTEM
========================================== */

function speak(text) {
    if (!voiceEnabled || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = isArabic() ? "ar-EG" : "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
}

function updateVoiceStatus() {
    if (voiceToggle) {
        voiceToggle.innerHTML = `
            <i class="fa-solid ${voiceEnabled ? "fa-volume-high" : "fa-volume-xmark"}"></i>
            <span>${getText("الصوت يعمل", "Voice ON")}</span>
        `;

        if (!voiceEnabled) {
            voiceToggle.querySelector("span").textContent =
                getText("الصوت متوقف", "Voice OFF");
        }
    }

    if (voiceStatus) {
        voiceStatus.textContent = voiceEnabled
            ? getText("الإرشاد الصوتي مفعل.", "Voice guidance is enabled.")
            : getText("الإرشاد الصوتي متوقف.", "Voice guidance is disabled.");
    }
}

voiceToggle?.addEventListener("click", () => {
    voiceEnabled = !voiceEnabled;

    const settings = getAppSettings();

    settings.voiceEnabled = voiceEnabled;
    settings.voice_enabled = voiceEnabled;

    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    localStorage.setItem("voice_enabled", String(voiceEnabled));

    if (!voiceEnabled) {
        window.speechSynthesis?.cancel();
    }

    updateVoiceStatus();

    window.dispatchEvent(
        new CustomEvent("appSettingsChanged", {
            detail: settings
        })
    );
});

/* ==========================================
   VIDEO LINKS
========================================== */

function updateVideoLinkText() {
    const text = getText(
        "شاهدي فيديو التمرين",
        "Watch Exercise Video"
    );

    ["exerciseVideoText", "demoVideoText"].forEach(id => {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = text;
        }
    });
}

function updateExerciseVideo(exercise) {
    if (!exercise) return;

    [exerciseVideoLink, demoVideoLink].forEach(link => {
        if (!link) return;

        link.href = exercise.video;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        link.setAttribute(
            "aria-label",
            getText("شاهدي فيديو التمرين", "Watch Exercise Video")
        );
    });

    updateVideoLinkText();
}

/* ==========================================
   RECOVERY INFORMATION
========================================== */

const weeklyRecoveryGuide = {
    1: {
        ar: "الأسبوع الأول: الراحة والتعافي الأولي حسب تعليمات الطبيب.",
        en: "Week 1: Rest and initial recovery according to your doctor's instructions."
    },
    2: {
        ar: "الأسبوع الثاني: الاستمرار في التعافي والحركة المسموح بها.",
        en: "Week 2: Continue recovery and approved gentle movement."
    },
    3: {
        ar: "الأسبوع الثالث: متابعة التقدم وفقًا لتعليمات الفريق الطبي.",
        en: "Week 3: Monitor progress according to your healthcare team's instructions."
    },
    4: {
        ar: "الأسبوع الرابع: الاستمرار في خطة التعافي المعتمدة.",
        en: "Week 4: Continue your approved recovery plan."
    },
    5: {
        ar: "الأسبوع الخامس: متابعة الحركة والراحة حسب إرشادات الطبيب.",
        en: "Week 5: Monitor movement and rest according to your doctor's guidance."
    },
    6: {
        ar: "الأسبوع السادس: الاستمرار في المتابعة الطبية.",
        en: "Week 6: Continue medical follow-up."
    },
    7: {
        ar: "الأسبوع السابع: متابعة التحسن مع الفريق الطبي.",
        en: "Week 7: Monitor improvement with your healthcare team."
    },
    8: {
        ar: "الأسبوع الثامن: الالتزام بخطة التعافي والمتابعة.",
        en: "Week 8: Follow your recovery and follow-up plan."
    }
};

function loadSurgeryInformation() {
    const settings = getAppSettings();

    const surgeryType =
        settings.surgery_type ||
        settings.surgeryType;

    const surgeryDate =
        settings.surgery_date ||
        settings.surgeryDate;

    const surgeryTypeDisplay =
        document.getElementById("surgeryTypeDisplay");

    const daysDisplay =
        document.getElementById("daysSinceSurgery");

    const weekDisplay =
        document.getElementById("currentRecoveryWeek");

    const recoveryMessage =
        document.getElementById("recoveryMessage");

    if (surgeryTypeDisplay) {
        surgeryTypeDisplay.textContent =
            surgeryType || getText("غير محدد", "Not specified");
    }

    if (!surgeryDate) {
        if (daysDisplay) daysDisplay.textContent = "--";
        if (weekDisplay) weekDisplay.textContent = "--";

        if (recoveryMessage) {
            recoveryMessage.innerHTML = `
                <div class="recovery-week-card">
                    <p>${getText(
                        "لم يتم إدخال تاريخ الجراحة بعد.",
                        "Surgery date has not been entered yet."
                    )}</p>
                </div>
            `;
        }

        return;
    }

    const date = new Date(surgeryDate);

    if (Number.isNaN(date.getTime())) {
        if (daysDisplay) daysDisplay.textContent = "--";
        if (weekDisplay) weekDisplay.textContent = "--";
        return;
    }

    const days = Math.max(
        0,
        Math.floor(
            (new Date() - date) / (1000 * 60 * 60 * 24)
        )
    );

    const week = Math.min(
        8,
        Math.max(1, Math.ceil((days + 1) / 7))
    );

    if (daysDisplay) daysDisplay.textContent = days;
    if (weekDisplay) weekDisplay.textContent = week;

    const guide = weeklyRecoveryGuide[week];

    if (recoveryMessage && guide) {
        recoveryMessage.innerHTML = `
            <div class="recovery-week-card">
                <div class="recovery-week-top">
                    <h3>${getText(
                        "ملخص التعافي الأسبوعي",
                        "Weekly Recovery Overview"
                    )}</h3>

                    <span class="recovery-week-badge">
                        ${getText("الأسبوع", "Week")} ${week}
                    </span>
                </div>

                <p>${isArabic() ? guide.ar : guide.en}</p>
            </div>
        `;
    }
}

/* ==========================================
   EXERCISE DETAILS
========================================== */

let currentExercise = "shoulder-rolls";

function showExerciseDetails(resetCounters = true) {
    const exercise = exercises[currentExercise];

    if (!exercise) return;

    const title = isArabic()
        ? exercise.title[0]
        : exercise.title[1];

    if (exerciseTitle) {
        exerciseTitle.textContent = title;
    }

    if (exerciseImage) {
        exerciseImage.src = exercise.image;
        exerciseImage.alt = title;
        exerciseImage.style.display = "block";
    }

    if (exerciseDemoImage) {
        exerciseDemoImage.src = exercise.image;
        exerciseDemoImage.alt = title;
    }

    if (exerciseDescription) {
        exerciseDescription.textContent = isArabic()
            ? exercise.description[0]
            : exercise.description[1];
    }

    if (exerciseSteps) {
        exerciseSteps.innerHTML = "";

        const list = document.createElement("ol");

        exercise.steps.forEach(step => {
            const li = document.createElement("li");

            li.textContent = isArabic()
                ? step[0]
                : step[1];

            list.appendChild(li);
        });

        exerciseSteps.appendChild(list);
    }

    if (demoCaption) {
        demoCaption.textContent = getText(
            "اتبعي الحركة الموضحة في الصورة.",
            "Follow the movement shown in the demonstration."
        );
    }

    updateExerciseVideo(exercise);

    if (resetCounters) {
        resetMovementCounters();
    }
}

exerciseSelect?.addEventListener("change", () => {
    currentExercise = exerciseSelect.value;
    showExerciseDetails(true);
});

exerciseVoiceButton?.addEventListener("click", () => {
    const exercise = exercises[currentExercise];

    if (!exercise) return;

    speak(
        isArabic()
            ? exercise.voice[0]
            : exercise.voice[1]
    );
});

/* ==========================================
   MEDIAPIPE INITIALIZATION
========================================== */

let poseLandmarker = null;
let handLandmarker = null;

let cameraStream = null;
let cameraRunning = false;
let isInitializing = false;

let lastVideoTime = -1;

async function initializeAI() {
    if (poseLandmarker) return true;

    if (isInitializing) {
        return false;
    }

    isInitializing = true;

    if (statusElement) {
        statusElement.textContent = getText(
            "جارٍ تحميل نموذج الذكاء الاصطناعي...",
            "Loading AI model..."
        );
    }

    try {
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
        );

        poseLandmarker = await PoseLandmarker.createFromOptions(
            vision,
            {
                baseOptions: {
                    modelAssetPath:
                        "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
                    delegate: "GPU"
                },
                runningMode: "VIDEO",
                numPoses: 1
            }
        );

        handLandmarker = await HandLandmarker.createFromOptions(
            vision,
            {
                baseOptions: {
                    modelAssetPath:
                        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
                    delegate: "GPU"
                },
                runningMode: "VIDEO",
                numHands: 2
            }
        );

        if (statusElement) {
            statusElement.textContent = getText(
                "نموذج الذكاء الاصطناعي جاهز.",
                "AI model is ready."
            );
        }

        return true;

    } catch (error) {
        console.error("AI initialization error:", error);

        if (statusElement) {
            statusElement.textContent = getText(
                "حدث خطأ أثناء تحميل النموذج.",
                "Error loading AI model."
            );
        }

        return false;

    } finally {
        isInitializing = false;
    }
}

/* ==========================================
   MOVEMENT TRACKING
========================================== */

let repetitions = 0;
let movementState = false;

let smoothedAngle = null;
let lastValidAngle = null;

const SMOOTHING_FACTOR = 0.25;

let lastRepetitionTime = 0;

function resetMovementCounters() {
    repetitions = 0;
    movementState = false;

    smoothedAngle = null;
    lastValidAngle = null;
    lastRepetitionTime = 0;

    if (repetitionsElement) {
        repetitionsElement.textContent = "0";
    }

    if (armAngleElement) {
        armAngleElement.textContent = "--";
    }

    if (sessionStatusElement) {
        sessionStatusElement.textContent = getText(
            "لم تبدأ",
            "Not Started"
        );
    }
}

function calculateAngle(a, b, c) {
    const radians =
        Math.atan2(c.y - b.y, c.x - b.x) -
        Math.atan2(a.y - b.y, a.x - b.x);

    let angle = Math.abs(radians * 180 / Math.PI);

    if (angle > 180) {
        angle = 360 - angle;
    }

    return angle;
}

function isVisible(point) {
    return point &&
        (point.visibility === undefined || point.visibility > 0.5);
}

function smoothAngle(angle) {
    if (smoothedAngle === null) {
        smoothedAngle = angle;
    } else {
        smoothedAngle =
            SMOOTHING_FACTOR * angle +
            (1 - SMOOTHING_FACTOR) * smoothedAngle;
    }

    lastValidAngle = smoothedAngle;

    return smoothedAngle;
}

function registerRepetition() {
    const now = Date.now();

    if (now - lastRepetitionTime < 700) return;

    repetitions++;
    lastRepetitionTime = now;

    if (repetitionsElement) {
        repetitionsElement.textContent = repetitions;
    }

    if (voiceEnabled && repetitions % 5 === 0) {
        speak(
            `${getText("أحسنتِ!", "Great job!")} ${repetitions} ${getText(
                "تكرارات",
                "repetitions"
            )}`
        );
    }
}

/* ==========================================
   EXERCISE DETECTION
========================================== */

function countElbowBends(angle) {
    if (angle < 65) {
        movementState = true;
    }

    if (angle > 145 && movementState) {
        registerRepetition();
        movementState = false;
    }
}

function countArmLifts(angle) {
    if (angle > 75) {
        movementState = true;
    }

    if (angle < 35 && movementState) {
        registerRepetition();
        movementState = false;
    }
}

function countShoulderBlade(angle) {
    if (angle < 65) {
        movementState = true;
    }

    if (angle > 90 && movementState) {
        registerRepetition();
        movementState = false;
    }
}

function countShoulderRolls(angle) {
    if (angle > 75) {
        movementState = true;
    }

    if (angle < 45 && movementState) {
        registerRepetition();
        movementState = false;
    }
}

function countHandMovements(handLandmarks) {
    if (!handLandmarks || handLandmarks.length === 0) return;

    const hand = handLandmarks[0];

    const wrist = hand[0];
    const fingerTip = hand[8];

    if (!wrist || !fingerTip) return;

    const distance = Math.hypot(
        fingerTip.x - wrist.x,
        fingerTip.y - wrist.y
    );

    if (distance < 0.18) {
        movementState = true;
    }

    if (distance > 0.25 && movementState) {
        registerRepetition();
        movementState = false;
    }
}

/* ==========================================
   POSE DRAWING
========================================== */

function drawPose(landmarks) {
    if (!ctx || !poseCanvas || !camera) return;

    poseCanvas.width = camera.videoWidth;
    poseCanvas.height = camera.videoHeight;

    ctx.clearRect(
        0,
        0,
        poseCanvas.width,
        poseCanvas.height
    );

    if (!landmarks) return;

    const connections = PoseLandmarker.POSE_CONNECTIONS;

    ctx.strokeStyle = "#ff4f91";
    ctx.lineWidth = 4;

    connections.forEach(connection => {
        const start = landmarks[connection.start];
        const end = landmarks[connection.end];

        if (!start || !end) return;

        ctx.beginPath();

        ctx.moveTo(
            start.x * poseCanvas.width,
            start.y * poseCanvas.height
        );

        ctx.lineTo(
            end.x * poseCanvas.width,
            end.y * poseCanvas.height
        );

        ctx.stroke();
    });

    ctx.fillStyle = "#ffffff";

    landmarks.forEach(point => {
        if (point.visibility !== undefined && point.visibility < 0.5) {
            return;
        }

        ctx.beginPath();

        ctx.arc(
            point.x * poseCanvas.width,
            point.y * poseCanvas.height,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();
    });
}

/* ==========================================
   POSITION CHECK
========================================== */

function checkPosition(landmarks) {
    if (!landmarks || landmarks.length < 25) return false;

    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];

    const leftHip = landmarks[23];
    const rightHip = landmarks[24];

    const valid =
        isVisible(leftShoulder) &&
        isVisible(rightShoulder) &&
        isVisible(leftHip) &&
        isVisible(rightHip);

    if (bodyStatus) {
        bodyStatus.textContent = valid
            ? getText("تم اكتشاف الجسم", "Body detected")
            : getText("لم يتم اكتشاف الجسم", "Body not detected");
    }

    if (positionStatus) {
        positionStatus.textContent = valid
            ? getText("جيدة", "Good")
            : getText("عدلي وضعيتك", "Adjust position");
    }

    return valid;
}

/* ==========================================
   ARM TRACKING
========================================== */

function trackArm(landmarks) {
    if (!landmarks || landmarks.length < 25) return;

    const shoulder = landmarks[12];
    const elbow = landmarks[14];
    const wrist = landmarks[16];

    if (
        !isVisible(shoulder) ||
        !isVisible(elbow) ||
        !isVisible(wrist)
    ) {
        if (armAngleElement) {
            armAngleElement.textContent =
                lastValidAngle === null
                    ? "--"
                    : `${Math.round(lastValidAngle)}°`;
        }

        return;
    }

    const angle = calculateAngle(
        shoulder,
        elbow,
        wrist
    );

    const finalAngle = smoothAngle(angle);

    if (armAngleElement) {
        armAngleElement.textContent =
            `${Math.round(finalAngle)}°`;
    }

    switch (currentExercise) {
        case "elbow-bends":
            countElbowBends(finalAngle);
            break;

        case "arm-lifts":
            countArmLifts(finalAngle);
            break;

        case "shoulder-blade":
            countShoulderBlade(finalAngle);
            break;

        case "shoulder-rolls":
            countShoulderRolls(finalAngle);
            break;
    }
}

/* ==========================================
   POSE DETECTION
========================================== */

function detectPose() {
    if (!cameraRunning || !poseLandmarker || !camera) {
        return;
    }

    if (camera.readyState < 2) {
        requestAnimationFrame(detectPose);
        return;
    }

    const now = performance.now();

    if (camera.currentTime !== lastVideoTime) {
        lastVideoTime = camera.currentTime;

        try {
            const results = poseLandmarker.detectForVideo(
                camera,
                now
            );

            const landmarks = results.landmarks?.[0];

            if (landmarks) {
                drawPose(landmarks);

                const valid = checkPosition(landmarks);

                if (valid) {
                    trackArm(landmarks);

                    if (statusElement) {
                        statusElement.textContent = getText(
                            "تم اكتشاف الجسم.",
                            "Body detected."
                        );
                    }
                }
            } else {
                if (ctx && poseCanvas) {
                    ctx.clearRect(
                        0,
                        0,
                        poseCanvas.width,
                        poseCanvas.height
                    );
                }

                if (bodyStatus) bodyStatus.textContent = "--";

                if (positionStatus) positionStatus.textContent = "--";

                if (statusElement) {
                    statusElement.textContent = getText(
                        "في انتظار اكتشاف الجسم...",
                        "Waiting for body detection..."
                    );
                }
            }

            if (currentExercise === "hand-movements" && handLandmarker) {
                const handResults = handLandmarker.detectForVideo(
                    camera,
                    now
                );

                countHandMovements(
                    handResults.landmarks?.[0]
                );
            }

        } catch (error) {
            console.error("Detection error:", error);
        }
    }

    if (cameraRunning) {
        requestAnimationFrame(detectPose);
    }
}

/* ==========================================
   CAMERA CONTROLS
========================================== */

async function startCamera() {
    if (cameraRunning) return;

    if (!navigator.mediaDevices?.getUserMedia) {
        if (statusElement) {
            statusElement.textContent = getText(
                "المتصفح لا يدعم تشغيل الكاميرا أو أن الصفحة ليست على اتصال آمن.",
                "Camera access is unavailable. Use HTTPS or localhost."
            );
        }

        return;
    }

    try {
        const ready = await initializeAI();

        if (!ready || !poseLandmarker) {
            throw new Error("AI model is not ready");
        }

        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "user",
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        });

        camera.srcObject = cameraStream;

        await camera.play();

        camera.style.display = "block";

        if (cameraPlaceholder) {
            cameraPlaceholder.style.display = "none";
        }

        cameraRunning = true;
        lastVideoTime = -1;

        resetMovementCounters();

        if (sessionStatusElement) {
            sessionStatusElement.textContent = getText(
                "جارية",
                "Running"
            );
        }

        if (statusElement) {
            statusElement.textContent = getText(
                "الكاميرا تعمل الآن.",
                "Camera is running."
            );
        }

        if (messageElement) {
            messageElement.textContent = getText(
                "اتبعي الحركة الموضحة أمامك.",
                "Follow the exercise demonstration."
            );
        }

        detectPose();

    } catch (error) {
        console.error("Camera error:", error);

        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            cameraStream = null;
        }

        cameraRunning = false;

        if (statusElement) {
            statusElement.textContent = getText(
                "تعذر تشغيل الكاميرا. تأكدي من السماح باستخدامها.",
                "Unable to start camera. Please allow camera access."
            );
        }
    }
}

function stopCamera() {
    cameraRunning = false;

    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }

    if (camera) {
        camera.pause();
        camera.srcObject = null;
        camera.style.display = "none";
    }

    if (cameraPlaceholder) {
        cameraPlaceholder.style.display = "flex";
    }

    if (ctx && poseCanvas) {
        ctx.clearRect(
            0,
            0,
            poseCanvas.width,
            poseCanvas.height
        );
    }

    if (statusElement) {
        statusElement.textContent = getText(
            "تم إيقاف الكاميرا.",
            "Camera stopped."
        );
    }

    if (sessionStatusElement) {
        sessionStatusElement.textContent = getText(
            "لم تبدأ",
            "Not Started"
        );
    }

    if (bodyStatus) bodyStatus.textContent = "--";
    if (positionStatus) positionStatus.textContent = "--";
}

startCameraButton?.addEventListener("click", startCamera);
stopCameraButton?.addEventListener("click", stopCamera);

/* ==========================================
   LANGUAGE UPDATE
========================================== */

function refreshExerciseLanguage() {
    const newLanguage = getAppLanguage();

    if (newLanguage === currentLanguage) {
        return;
    }

    currentLanguage = newLanguage;

    window.speechSynthesis?.cancel();

    translateStaticContent();

    showExerciseDetails(false);

    updateVoiceStatus();

    loadSurgeryInformation();

    if (statusElement && !cameraRunning) {
        statusElement.textContent = getText(
            "نموذج الذكاء الاصطناعي في انتظار التشغيل.",
            "AI model is waiting."
        );
    }

    if (messageElement && !cameraRunning) {
        messageElement.textContent = getText(
            "اختاري تمرينًا معتمدًا قبل البدء.",
            "Select an approved exercise before starting."
        );
    }

    if (sessionStatusElement && !cameraRunning) {
        sessionStatusElement.textContent = getText(
            "لم تبدأ",
            "Not Started"
        );
    }
}

/* ==========================================
   SETTINGS LISTENERS
========================================== */

window.addEventListener("storage", event => {
    if (
        event.key === SETTINGS_KEY ||
        event.key === LANGUAGE_KEY ||
        event.key === "voice_enabled"
    ) {
        const oldLanguage = currentLanguage;

        currentLanguage = getAppLanguage();
        voiceEnabled = getVoiceSetting();

        if (oldLanguage !== currentLanguage) {
            refreshExerciseLanguage();
        } else {
            updateVoiceStatus();
            loadSurgeryInformation();
        }
    }
});

window.addEventListener("appSettingsChanged", () => {
    const oldLanguage = currentLanguage;

    currentLanguage = getAppLanguage();
    voiceEnabled = getVoiceSetting();

    if (oldLanguage !== currentLanguage) {
        refreshExerciseLanguage();
    } else {
        updateVoiceStatus();
        loadSurgeryInformation();
    }
});

window.addEventListener("globalLanguageChanged", event => {
    const newLanguage = event.detail?.language || getAppLanguage();

    if (newLanguage !== currentLanguage) {
        currentLanguage = newLanguage;
        refreshExerciseLanguage();
    }
});

/* ==========================================
   INITIALIZATION
========================================== */

function initializePage() {
    currentLanguage = getAppLanguage();
    voiceEnabled = getVoiceSetting();

    translateStaticContent();

    if (exerciseSelect) {
        currentExercise = exerciseSelect.value || "shoulder-rolls";
    }

    showExerciseDetails();

    updateVoiceStatus();

    loadSurgeryInformation();

    if (statusElement) {
        statusElement.textContent = getText(
            "نموذج الذكاء الاصطناعي في انتظار التشغيل.",
            "AI model is waiting."
        );
    }

    if (sessionStatusElement) {
        sessionStatusElement.textContent = getText(
            "لم تبدأ",
            "Not Started"
        );
    }
}

initializePage();




