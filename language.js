// ==========================================
// Recovery Companion - Global Language System
// ==========================================

(function () {
    const LANGUAGE_KEY = "app_language";
    const SETTINGS_KEY = "recoveryAppSettings";

    const translations = {
        en: {
            // Sidebar
            mainMenu: "MAIN MENU",
            dashboard: "Dashboard",
            exerciseCoach: "Exercise Coach",
            medications: "Medications",
            dailyCheckin: "Daily Check-in",
            myProgress: "My Progress",
            awareness: "Awareness",
            settings: "Settings",

            // Help
            helpTitle: "We're here for you",
            helpText: "Your recovery journey matters. Take it one day at a time.",

            // Header
            recoverySpace: "YOUR RECOVERY SPACE",
            welcome: "Welcome back,",
            patientAccount: "Patient Account",
            logout: "Logout",

            // Dashboard Hero
            heroTag: "YOUR JOURNEY, YOUR STRENGTH",
            heroTitle: "Every small step<br>is a big victory.",
            heroDescription: "Your recovery journey is unique. Let's make today a healthier day together.",
            startJourney: "Start Today's Journey",

            // Overview
            overview: "Your Overview",
            overviewDescription: "A little progress every day adds up.",

            // Exercises
            todaysExercises: "Today's Exercises",
            demoInformation: "Demo information",
            medication: "Medication",
            medicationPending: "Pending",
            recoveryDays: "Recovery Days",
            gentleMovements: "Gentle movements for your recovery.",
            viewAll: "View all",
            shoulderMobility: "Shoulder Mobility",
            shoulderDuration: "5 minutes · Gentle movement",
            armStretching: "Arm Stretching",
            armDuration: "5 minutes · Guided exercise",
            handMovements: "Hand Movements",
            handDuration: "3 minutes · Gentle exercise",
            start: "Start",
            medicalNote: "Exercises must follow your medical team's instructions.",

            // Reminders
            upcomingReminders: "Upcoming Reminders",
            remindersDescription: "Stay on track with your schedule.",
            doctorMedicationNote: "Medication schedules are set by your doctor.",

            // Daily Check-in
            dailyHealthCheck: "Daily Health Check 💗",
            healthCheckDescription: "Tell us how you are feeling today.",
            openCheckin: "Open Check-in",
            healthPreview: "Your daily health assessment helps you record pain, wound condition, arm swelling, and fatigue.",
            goToCheckin: "Go to Daily Check-in",

            // Progress
            recoveryJourney: "Your Recovery Journey",
            progressDescription: "Keep track of your daily progress.",
            viewDetails: "View details",
            demoProgress: "Demo progress",
            doingGreat: "You're doing great! 💗",
            progressMessage: "Every step matters. Keep following your personalized recovery plan.",
            footerMessage: "Made with ♥ for your recovery journey.",

            // Settings
            personalInformation: "Personal Information",
            updateProfileInformation: "Update your profile information.",
            yourName: "Your Name",
            enterYourName: "Enter your name",

            preferences: "Preferences",
            customizeExperience: "Customize your experience.",
            language: "Language",

            voiceGuidance: "Voice Guidance",
            voiceGuidanceDescription: "Enable spoken instructions and guidance.",

            reminders: "Reminders",
            remindersSettingsDescription: "Receive reminders for medications and exercises.",

            dataManagement: "Data Management",
            dataManagementDescription: "Manage your saved application data.",
            clearDataWarning: "This action will clear your saved health checks and medication data.",

            languageHelp: "Your language preference will apply across the website.",
            saveSettings: "Save Settings",
            settingsSaved: "Settings saved successfully!",
            clearData: "Clear All Saved Data",
            confirmClearData: "Are you sure you want to clear all saved application data?",
            dataCleared: "Saved application data cleared.",

            // General
            loading: "Loading...",
            noData: "No data available.",
            error: "Something went wrong.",
            cancel: "Cancel",
            yes: "Yes",
            no: "No"
        },

        ar: {
            // Sidebar
            mainMenu: "القائمة الرئيسية",
            dashboard: "الرئيسية",
            exerciseCoach: "مدرب التمارين",
            medications: "الأدوية",
            dailyCheckin: "التقييم اليومي",
            myProgress: "تقدمي",
            awareness: "مركز التوعية",
            settings: "الإعدادات",

            // Help
            helpTitle: "نحن هنا من أجلك",
            helpText: "رحلة تعافيك مهمة. خذي كل يوم خطوة بخطوة.",

            // Header
            recoverySpace: "مساحتك للتعافي",
            welcome: "مرحبًا بعودتك،",
            patientAccount: "حساب المريضة",
            logout: "تسجيل الخروج",

            // Dashboard Hero
            heroTag: "رحلتك هي مصدر قوتك",
            heroTitle: "كل خطوة صغيرة<br>هي انتصار كبير.",
            heroDescription: "رحلة تعافيك مميزة. لنجعل اليوم يومًا أكثر صحة معًا.",
            startJourney: "ابدئي رحلة اليوم",

            // Overview
            overview: "نظرة عامة",
            overviewDescription: "التقدم البسيط كل يوم يصنع فرقًا كبيرًا.",

            // Exercises
            todaysExercises: "تمارين اليوم",
            demoInformation: "بيانات تجريبية",
            medication: "الأدوية",
            medicationPending: "قيد الانتظار",
            recoveryDays: "أيام التعافي",
            gentleMovements: "حركات بسيطة تساعدك في رحلة التعافي.",
            viewAll: "عرض الكل",
            shoulderMobility: "تمارين حركة الكتف",
            shoulderDuration: "5 دقائق · حركة بسيطة",
            armStretching: "تمارين تمدد الذراع",
            armDuration: "5 دقائق · تمرين إرشادي",
            handMovements: "حركات اليد",
            handDuration: "3 دقائق · تمرين بسيط",
            start: "ابدئي",
            medicalNote: "يجب أداء التمارين وفقًا لتعليمات الفريق الطبي.",

            // Reminders
            upcomingReminders: "التذكيرات القادمة",
            remindersDescription: "حافظي على الالتزام بجدولك.",
            doctorMedicationNote: "يحدد الطبيب مواعيد تناول الأدوية.",

            // Daily Check-in
            dailyHealthCheck: "التقييم الصحي اليومي 💗",
            healthCheckDescription: "أخبرينا كيف تشعرين اليوم.",
            openCheckin: "افتحي التقييم",
            healthPreview: "يساعدك التقييم الصحي اليومي على تسجيل الألم وحالة الجرح وتورم الذراع والإرهاق.",
            goToCheckin: "الانتقال إلى التقييم اليومي",

            // Progress
            recoveryJourney: "رحلة تعافيك",
            progressDescription: "تابعي تقدمك اليومي.",
            viewDetails: "عرض التفاصيل",
            demoProgress: "تقدم تجريبي",
            doingGreat: "أنتِ تقومين بعمل رائع! 💗",
            progressMessage: "كل خطوة مهمة. استمري في اتباع خطة التعافي المخصصة لك.",
            footerMessage: "صُنع بكل ♥ لدعم رحلة تعافيك.",

            // Settings
            personalInformation: "المعلومات الشخصية",
            updateProfileInformation: "حدّثي معلومات ملفك الشخصي.",
            yourName: "اسمك",
            enterYourName: "أدخلي اسمك",

            preferences: "التفضيلات",
            customizeExperience: "خصصي تجربتك حسب احتياجاتك.",
            language: "اللغة",

            voiceGuidance: "الإرشاد الصوتي",
            voiceGuidanceDescription: "تفعيل التعليمات والإرشادات الصوتية.",

            reminders: "التذكيرات",
            remindersSettingsDescription: "استقبلي تذكيرات بمواعيد الأدوية والتمارين.",

            dataManagement: "إدارة البيانات",
            dataManagementDescription: "إدارة البيانات المحفوظة في الموقع.",
            clearDataWarning: "سيؤدي هذا الإجراء إلى مسح التقييمات الصحية وبيانات الأدوية المحفوظة.",

            languageHelp: "سيتم تطبيق اللغة التي تختارينها على جميع صفحات الموقع.",
            saveSettings: "حفظ الإعدادات",
            settingsSaved: "تم حفظ الإعدادات بنجاح!",
            clearData: "مسح جميع البيانات المحفوظة",
            confirmClearData: "هل أنتِ متأكدة من رغبتك في مسح جميع بيانات الموقع المحفوظة؟",
            dataCleared: "تم مسح بيانات الموقع المحفوظة.",

            // General
            loading: "جارٍ التحميل...",
            noData: "لا توجد بيانات متاحة.",
            error: "حدث خطأ ما.",
            cancel: "إلغاء",
            yes: "نعم",
            no: "لا"
        }
    };

    // Get saved language
    function getCurrentLanguage() {
        try {
            const settings = JSON.parse(
                localStorage.getItem(SETTINGS_KEY)
            ) || {};

            const language =
                localStorage.getItem(LANGUAGE_KEY) ||
                settings.language ||
                settings.app_language ||
                "en";

            return translations[language] ? language : "en";

        } catch (error) {
            return "en";
        }
    }

    // Apply language and direction
    function translatePage() {
        const language = getCurrentLanguage();
        const dictionary = translations[language] || translations.en;

        document.documentElement.lang = language;
        document.documentElement.dir =
            language === "ar" ? "rtl" : "ltr";

        document.body.classList.toggle(
            "arabic-language",
            language === "ar"
        );

        // Translate text and HTML
        document.querySelectorAll("[data-i18n]").forEach(element => {
            const key = element.dataset.i18n;

            if (dictionary[key] !== undefined) {
                element.innerHTML = dictionary[key];
            }
        });

        // Translate placeholders
        document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
            const key = element.dataset.i18nPlaceholder;

            if (dictionary[key] !== undefined) {
                element.placeholder = dictionary[key];
            }
        });

        // Translate titles
        document.querySelectorAll("[data-i18n-title]").forEach(element => {
            const key = element.dataset.i18nTitle;

            if (dictionary[key] !== undefined) {
                element.title = dictionary[key];
            }
        });

        // Update current language
        window.currentAppLanguage = language;

        // Notify other scripts
        window.dispatchEvent(
            new CustomEvent("globalLanguageChanged", {
                detail: { language }
            })
        );
    }

    // Make functions available globally
    window.getCurrentLanguage = getCurrentLanguage;
    window.translatePage = translatePage;

    // Apply language when page loads
    document.addEventListener("DOMContentLoaded", translatePage);

    // Listen for language changes from another tab
    window.addEventListener("storage", event => {
        if (
            event.key === LANGUAGE_KEY ||
            event.key === SETTINGS_KEY
        ) {
            translatePage();
        }
    });

    // Listen for settings changes
    window.addEventListener("appSettingsChanged", translatePage);

})();


