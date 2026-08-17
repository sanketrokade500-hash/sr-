import React, { useState } from 'react';
import { X, Copy, Check, Code, Smartphone } from 'lucide-react';

interface FlutterCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlutterCodeModal: React.FC<FlutterCodeModalProps> = ({ isOpen, onClose }) => {
  const [activeFile, setActiveFile] = useState<'apk_instructions' | 'main' | 'theme' | 'vehicle' | 'dashboard' | 'add_vehicle' | 'manifest'>('apk_instructions');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const flutterCodeMap = {
    apk_instructions: `====================================================================
📱 KISHOR ENTERPRISES - ANDROID RELEASE APK BUILD GUIDE
====================================================================
Target Package Name : com.kishorenterprises.fleetmanager
APK Output Name     : KishorEnterprises.apk
Target Android SDK  : Android 8.0+ (API Level 26 - 34)

--------------------------------------------------------------------
⚡ OPTION 1: CAPACITOR / NATIVE ANDROID BUILD (Easiest)
--------------------------------------------------------------------
1. Export/Zip this project codebase to your local machine.
2. Ensure Node.js and Android Studio are installed.
3. Open your terminal in the project directory and run:
   
   npm install
   npm run build
   npx cap add android
   npx cap copy android
   npx cap open android

4. In Android Studio:
   - Go to: Build > Build Bundle(s) / APK(s) > Build APK(s)
   - Or run in terminal: 
     cd android && ./gradlew assembleDebug
   - Rename output to: KishorEnterprises.apk

--------------------------------------------------------------------
🚀 OPTION 2: FLUTTER NATIVE APP BUILD
--------------------------------------------------------------------
1. Create a new Flutter app:
   flutter create --org com.kishorenterprises fleetmanager
2. Copy the Flutter source files from the tabs above (main.dart, 
   app_theme.dart, vehicle_model.dart, etc.) into your 'lib/' folder.
3. Run the Flutter release build command:
   
   flutter build apk --release

4. Your compiled APK will be at:
   build/app/outputs/flutter-apk/app-release.apk
   (Rename file to: KishorEnterprises.apk)
====================================================================`,

    main: `// lib/main.dart
import 'package:flutter/material.dart';
import 'package:kishor_enterprises/theme/app_theme.dart';
import 'package:kishor_enterprises/screens/splash_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const KishorEnterprisesApp());
}

class KishorEnterprisesApp extends StatelessWidget {
  const KishorEnterprisesApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Kishor Enterprises',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkGoldTheme,
      home: const SplashScreen(),
    );
  }
}`,

    manifest: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.kishoredrivingschool.fleetmanager">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.CAMERA" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Kishor Enterprises"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">

        <activity
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:name=".MainActivity"
            android:label="Kishor Enterprises"
            android:theme="@style/AppTheme.NoActionBarLaunch"
            android:launchMode="singleTask"
            android:exported="true">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,

    theme: `// lib/theme/app_theme.dart
import 'package:flutter/material.dart';

class AppTheme {
  static const Color primaryGold = Color(0xFFFFD700);
  static const Color secondaryAmber = Color(0xFFFFC107);
  static const Color darkBackground = Color(0xFF0B0D13);
  static const Color surfaceCard = Color(0xFF141722);
  
  static ThemeData get darkGoldTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: darkBackground,
      colorScheme: const ColorScheme.dark(
        primary: primaryGold,
        secondary: secondaryAmber,
        surface: surfaceCard,
        background: darkBackground,
        onPrimary: Colors.black,
      ),
      cardTheme: CardTheme(
        color: surfaceCard,
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: Color(0x33FFD700)),
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: darkBackground,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: primaryGold,
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}`,

    vehicle: `// lib/models/vehicle_model.dart
class VehicleModel {
  final String id;
  final String vehicleNumber;
  final String vehicleType;
  final String vehicleModel;
  final String ownerName;
  final String ownerMobile;
  final String driverName;
  final String driverMobile;
  final double paymentAmount;
  final double paidAmount;
  final String paymentStatus; // paid, unpaid, partial
  final String insuranceExpiry;
  final String pucExpiry;
  final String fitnessExpiry;
  final String permitExpiry;
  final String taxExpiry;

  VehicleModel({
    required this.id,
    required this.vehicleNumber,
    required this.vehicleType,
    required this.vehicleModel,
    required this.ownerName,
    required this.ownerMobile,
    required this.driverName,
    required this.driverMobile,
    required this.paymentAmount,
    required this.paidAmount,
    required this.paymentStatus,
    required this.insuranceExpiry,
    required this.pucExpiry,
    required this.fitnessExpiry,
    required this.permitExpiry,
    required this.taxExpiry,
  });

  factory VehicleModel.fromJson(Map<String, dynamic> json) {
    return VehicleModel(
      id: json['id'] ?? '',
      vehicleNumber: json['vehicleNumber'] ?? '',
      vehicleType: json['vehicleType'] ?? '',
      vehicleModel: json['vehicleModel'] ?? '',
      ownerName: json['ownerName'] ?? '',
      ownerMobile: json['ownerMobile'] ?? '',
      driverName: json['driverName'] ?? '',
      driverMobile: json['driverMobile'] ?? '',
      paymentAmount: (json['paymentAmount'] ?? 0).toDouble(),
      paidAmount: (json['paidAmount'] ?? 0).toDouble(),
      paymentStatus: json['paymentStatus'] ?? 'unpaid',
      insuranceExpiry: json['insuranceExpiry'] ?? '',
      pucExpiry: json['pucExpiry'] ?? '',
      fitnessExpiry: json['fitnessExpiry'] ?? '',
      permitExpiry: json['permitExpiry'] ?? '',
      taxExpiry: json['taxExpiry'] ?? '',
    );
  }
}`,

    dashboard: `// lib/screens/dashboard_screen.dart
import 'package:flutter/material.dart';
import 'package:kishor_enterprises/widgets/dashboard_card.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Kishor Enterprises'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_active_outlined, color: Color(0xFFFFD700)),
            onPressed: () {},
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Search Bar
            TextField(
              decoration: InputDecoration(
                hintText: 'Search Vehicle Number, Owner...',
                prefixIcon: const Icon(Icons.search, color: Color(0xFFFFD700)),
                filled: true,
                fillColor: const Color(0xFF1B1F2D),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 20),
            // Dashboard Grid Cards
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.4,
              children: const [
                DashboardCard(title: 'Total Vehicles', count: '28', icon: Icons.minor_crash, color: Colors.amber),
                DashboardCard(title: 'Paid Vehicles', count: '20', icon: Icons.verified, color: Colors.blue),
                DashboardCard(title: 'Unpaid Vehicles', count: '8', icon: Icons.pending_actions, color: Colors.red),
                DashboardCard(title: 'Insurance Expiring', count: '4', icon: Icons.security, color: Colors.orange),
                DashboardCard(title: 'PUC Expiring', count: '3', icon: Icons.eco, color: Colors.yellow),
                DashboardCard(title: 'Fitness Expiring', count: '2', icon: Icons.build_circle, color: Colors.redAccent),
              ],
            ),
          ],
        ),
      ),
    );
  }
}`,

    add_vehicle: `// lib/screens/add_vehicle_screen.dart
import 'package:flutter/material.dart';

class AddVehicleScreen extends StatefulWidget {
  const AddVehicleScreen({super.key});

  @override
  State<AddVehicleScreen> createState() => _AddVehicleScreenState();
}

class _AddVehicleScreenState extends State<AddVehicleScreen> {
  final _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Add New Vehicle')),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              decoration: const InputDecoration(labelText: 'Vehicle Number (e.g. MH 12 AB 1234)'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              decoration: const InputDecoration(labelText: 'Owner Name'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              decoration: const InputDecoration(labelText: 'Owner Mobile'),
              keyboardType: TextInputType.phone,
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFFFD700),
                foregroundColor: Colors.black,
                padding: const EdgeInsets.py(16),
              ),
              icon: const Icon(Icons.save),
              label: const Text('SAVE VEHICLE RECORD', style: TextStyle(fontWeight: FontWeight.bold)),
              onPressed: () {},
            )
          ],
        ),
      ),
    );
  }
}`
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(flutterCodeMap[activeFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="w-full max-w-3xl bg-[#10131E] border border-amber-500/50 rounded-3xl p-5 shadow-2xl flex flex-col h-[85vh] relative overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center p-0.5 shadow-md">
              <div className="w-full h-full bg-[#000000] rounded-[10px] flex items-center justify-center">
                <Code className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
                Flutter Clean Architecture Code
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                  Android Studio Ready
                </span>
              </h3>
              <p className="text-xs text-slate-300 font-bold">
                Generated Dart code for Kishor Enterprises Vehicle Management App
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#1C2030] hover:bg-[#252A3F] text-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* File Tabs */}
        <div className="flex items-center gap-2 pt-3 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
          {[
            { id: 'apk_instructions', name: '📱 Build APK Guide' },
            { id: 'manifest', name: 'AndroidManifest.xml' },
            { id: 'main', name: 'main.dart' },
            { id: 'theme', name: 'app_theme.dart' },
            { id: 'vehicle', name: 'vehicle_model.dart' },
            { id: 'dashboard', name: 'dashboard_screen.dart' },
            { id: 'add_vehicle', name: 'add_vehicle_screen.dart' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFile(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeFile === tab.id
                  ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Code Content Container */}
        <div className="flex-1 my-3 bg-[#08090D] border border-amber-500/20 rounded-2xl p-4 overflow-y-auto font-mono text-xs text-amber-200/90 leading-relaxed relative">
          <button
            onClick={handleCopyCode}
            className="absolute top-3 right-3 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 border border-amber-500/30 text-amber-300 text-xs font-sans font-semibold rounded-lg flex items-center gap-1.5 transition shadow"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>Copy Dart Code</span>
              </>
            )}
          </button>

          <pre>{flutterCodeMap[activeFile]}</pre>
        </div>

        {/* Bottom Banner */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
          <span className="flex items-center gap-1 text-slate-300">
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            Paste into your Flutter project lib/ directory
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 transition"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
