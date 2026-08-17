# 🚗 Kishore Driving School - Fleet & Vehicle Manager (Android APK Ready)

Production-ready Fleet, Vehicle Document, Expiry & Fee/Payment Management System for **Kishore Driving School**.

- **App Name:** Kishore Driving School
- **Android Package ID:** `com.kishordrivingschool.fleet`
- **Tech Stack:** React 19 + TypeScript + Vite + Tailwind CSS + Capacitor 8 + Android Native Wrapper + GitHub Actions Automated CI/CD

---

## 📁 Project File Structure (GitHub Upload Structure)

जब आप इस project को GitHub पर upload करेंगे, तो आपकी repository की structure ऐसी दिखेगी:

```text
├── .github/
│   └── workflows/
│       └── build-apk.yml          # ⚡ Automatic Android APK Builder CI/CD Workflow
├── android/                       # 🤖 Native Android Studio & Gradle Project
│   ├── app/
│   │   ├── src/
│   │   │   └── main/
│   │   │       ├── AndroidManifest.xml   # Permissions, Portrait Orientation & Package Config
│   │   │       ├── java/com/kishordrivingschool/fleet/MainActivity.java
│   │   │       └── res/values/strings.xml
│   │   ├── build.gradle
│   │   └── capacitor.build.gradle
│   ├── gradle/wrapper/
│   │   └── gradle-wrapper.properties
│   ├── build.gradle
│   ├── capacitor.settings.gradle
│   ├── gradlew                    # Linux/macOS Gradle executable
│   ├── gradlew.bat                # Windows Gradle executable
│   └── settings.gradle
├── src/                           # ⚛️ React 19 + TypeScript Source Code
│   ├── components/                # UI Components (CustomDropdown, Header, BottomNav, etc.)
│   ├── data/                      # Initial Data (Vehicles, Payments)
│   ├── screens/                   # Dashboard, Vehicles, AddVehicle, Payments, Reports, etc.
│   ├── services/                  # Persistent dataService (localStorage CRUD for vehicles & payments)
│   ├── utils/                     # Expiry calculations, CSV exports, formatting
│   ├── App.tsx                    # Main App with Android Back Button & Tab Navigation
│   ├── main.tsx
│   └── types.ts
├── public/                        # Public assets & icons
├── capacitor.config.ts            # Capacitor Native Configuration (App ID: com.kishordrivingschool.fleet)
├── capacitor.config.json
├── package.json                   # Dependencies & build scripts
├── tsconfig.json
├── vite.config.ts
├── .gitignore
└── README.md
```

---

## 🚀 GitHub Actions से Automatic APK कैसे बनाएं और Download करें (Step-by-Step Guide)

### 1️⃣ Step 1: GitHub पर New Repository बनाएं
1. [GitHub](https://github.com/) में Login करें।
2. ऊपर दाएँ कोने में `+` icon पर click करके **"New repository"** चुनें।
3. **Repository name** में `kishore-driving-school-app` लिखें।
4. इसे **Public** या **Private** रखें (दोनों में Actions काम करेगा)।
5. **"Create repository"** पर click करें।

---

### 2️⃣ Step 2: पूरा Project GitHub पर Upload / Push करें

#### Option A: Git CLI के माध्यम से (Recommended)
अपने computer के terminal में project folder खोलकर ये commands चलाएं:

```bash
git init
git add .
git commit -m "Initial commit - Kishore Driving School Fleet App with Android Capacitor Setup"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/kishore-driving-school-app.git
git push -u origin main
```

#### Option B: GitHub Web Upload के माध्यम से
1. AI Studio Settings से **Export to ZIP** करें।
2. ZIP file को extract करें।
3. GitHub repository page पर **"uploading an existing file"** पर click करके सभी files drag-and-drop कर दें और **Commit changes** दबाएं।

---

### 3️⃣ Step 3: GitHub Actions में APK Build होते देखें
1. GitHub Repository में ऊपर **"Actions"** tab पर click करें।
2. आपको **"Build Android Debug APK"** नाम का workflow दिखाई देगा।
3. जब आप code push करेंगे, यह workflow **automatically start** हो जाएगा।
4. लगभग 2 से 3 मिनट में यह automatically:
   - ✅ Node.js और Java 17 environment तैयार करेगा
   - ✅ React + TypeScript app को build करेगा
   - ✅ Capacitor sync करेगा
   - ✅ Android Gradle build चलाकर `app-debug.apk` बनाएगा
   - ✅ APK को Artifact के रूप में upload करेगा

> **Manual Trigger (वैकल्पिक):** आप Actions tab में **"Build Android Debug APK"** पर click करके दाएँ कोने में **"Run workflow"** button दबाकर कभी भी manually APK बना सकते हैं।

---

### 4️⃣ Step 4: APK Download करें
1. **Actions** tab में जाएँ और completed green checkmark (`✔`) वाले workflow run पर click करें।
2. Page के नीचे स्क्रॉल करके **"Artifacts"** section में जाएँ।
3. आपको **`Kishore-Driving-School-APK`** नाम का artifact दिखेगा।
4. उस पर click करके ZIP file download करें।
5. ZIP file extract करने पर आपको **`app-debug.apk`** मिल जाएगी।

---

### 5️⃣ Step 5: Android Phone में Install करें
1. `app-debug.apk` को अपने Android mobile में WhatsApp, Google Drive, या USB cable के जरिए transfer करें।
2. File Manager में APK पर tap करें।
3. यदि prompt आए तो **"Install from unknown sources"** allow करें।
4. **"Install"** दबाएं — आपका **Kishore Driving School** app तुरंत install होकर launch के लिए तैयार हो जाएगा!

---

### 🔄 Step 6: भविष्य में Code बदलने पर नया APK कैसे बनाएं?
जब भी आप React code, vehicle data, forms या UI में कोई बदलाव करेंगे:
1. बस code को GitHub पर commit और push करें:
   ```bash
   git add .
   git commit -m "Updated payment options & vehicle list"
   git push origin main
   ```
2. GitHub Actions **अपने-आप नया APK** build कर देगा।
3. Actions tab से नया `app-debug.apk` download कर लें!

---

## 💻 Local Machine पर APK Build करने का तरीका (अगर आपके पास Android Studio / Java है)

अगर आप अपने computer पर offline build करना चाहते हैं:

```bash
# 1. Install dependencies
npm install

# 2. Build web assets
npm run build

# 3. Sync with Android
npx cap sync android

# 4. Build Debug APK with Gradle
cd android
./gradlew assembleDebug

# Windows users:
# gradlew.bat assembleDebug
```

Generated APK location:
`android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📱 App Features Included
- 🚚 **Vehicle & Fleet Management:** Complete document tracking (Insurance, Fitness, PUC, Tax, Permit).
- 💰 **Payment & Fee Collection:** UPI, Cash, NEFT, Cheque, and Custom Other payment modes with automatic balance calculations & receipt histories.
- 🔔 **Expiry & WhatsApp Reminders:** 1-Click WhatsApp messaging for pending payments and expiring vehicle permits.
- 📊 **Audit Reports & CSV Exports:** Instant Excel/CSV download and financial analytics.
- 📱 **Mobile Native Experience:** Android hardware back button handler, touch dropdowns, offline persistent storage, and responsive layout.
