import React, { useState } from "react";
import { motion } from "motion/react";
import { HeartPulse, ShieldAlert, KeyRound, User, Stethoscope, ShieldCheck, Globe, Fingerprint, ScanFace, Phone, Send, IdCard, Lock, CheckCircle } from "lucide-react";
import { TRANSLATIONS, Doctor } from "../types";

interface LoginPortalProps {
  doctors: Doctor[];
  language: "en" | "hi" | "mr";
  setLanguage: (lang: "en" | "hi" | "mr") => void;
  onLoginSuccess: (
    session:
      | { role: "patient"; phone?: string; abhaId?: string }
      | { role: "doctor"; doctorId: string }
      | { role: "admin" }
  ) => void;
  logoutNotice?: string | null;
  setLogoutNotice?: (val: string | null) => void;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({
  doctors,
  language,
  setLanguage,
  onLoginSuccess,
  logoutNotice,
  setLogoutNotice,
}) => {
  const t = TRANSLATIONS[language];

  // Selected role tab for login UI
  const [activeRole, setActiveRole] = useState<"patient" | "doctor" | "admin">("patient");

  // Doctor credentials form state
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || "");
  const [doctorPin, setDoctorPin] = useState("");
  const [doctorError, setDoctorError] = useState("");

  // Admin credentials form state
  const [adminPin, setAdminPin] = useState("");
  const [adminError, setAdminError] = useState("");

  // Patient credentials state
  const [patientAuthMethod, setPatientAuthMethod] = useState<"mobile" | "abha">("mobile");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientOtp, setPatientOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [abhaId, setAbhaId] = useState("");
  const [abhaPin, setAbhaPin] = useState("");
  const [abhaError, setAbhaError] = useState("");
  const [abhaValidating, setAbhaValidating] = useState(false);

  const handleSendOtp = () => {
    setOtpError("");
    if (patientPhone.length !== 10) {
      setOtpError(
        language === "hi"
          ? "कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।"
          : language === "mr"
          ? "कृपया १० अंकी वैध मोबाईल नंबर प्रविष्ट करा."
          : "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    setOtpSending(true);
    setTimeout(() => {
      setOtpSending(false);
      setOtpSent(true);
      try {
        const text = "Your Demo O T P is 1 2 3 4 5 6";
        const speechMsg = new SpeechSynthesisUtterance(text);
        speechMsg.rate = 1.0;
        window.speechSynthesis.speak(speechMsg);
      } catch (e) {}
    }, 1200);
  };

  const handlePatientMobileLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");

    if (patientOtp === "123456" || patientOtp === "1234") {
      onLoginSuccess({ role: "patient", phone: patientPhone });
    } else {
      setOtpError(
        language === "hi"
          ? "गलत ओटीपी! डेमो सत्यापन के लिए '123456' या '1234' दर्ज करें।"
          : language === "mr"
          ? "चुकीचा ओटीपी! डेमो पडताळणीसाठी '123456' किंवा '1234' प्रविष्ट करा."
          : "Invalid OTP! Enter '123456' or '1234' for demo verification."
      );
    }
  };

  const handlePatientAbhaLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAbhaError("");

    if (!abhaId.trim()) {
      setAbhaError(
        language === "hi"
          ? "कृपया अपना आभा आईडी दर्ज करें।"
          : language === "mr"
          ? "कृपया आपला आभा आयडी प्रविष्ट करा."
          : "Please enter your ABHA ID."
      );
      return;
    }

    if (abhaPin === "1234") {
      setAbhaValidating(true);
      setTimeout(() => {
        setAbhaValidating(false);
        onLoginSuccess({ role: "patient", abhaId: abhaId });
      }, 1500);
    } else {
      setAbhaError(
        language === "hi"
          ? "गलत पिन! कृपया '1234' दर्ज करें।"
          : language === "mr"
          ? "चुकीचा पिन! कृपया '1234' प्रविष्ट करा."
          : "Invalid PIN! Please enter '1234' for demo validation."
      );
    }
  };

  const formatAbhaId = (value: string) => {
    const clean = value.replace(/[^0-9]/g, "");
    if (clean.length === 0) return value;
    let formatted = "";
    for (let i = 0; i < clean.length && i < 14; i++) {
      if (i === 2 || i === 6 || i === 10) {
        formatted += "-";
      }
      formatted += clean[i];
    }
    return formatted;
  };

  const handleAbhaChange = (val: string) => {
    const hasLetters = /[a-zA-Z@]/.test(val);
    if (hasLetters) {
      setAbhaId(val);
    } else {
      setAbhaId(formatAbhaId(val));
    }
  };

  // Biometric shift login placeholder simulation state
  const [biometricRole, setBiometricRole] = useState<"doctor" | "admin" | null>(null);
  const [biometricScanState, setBiometricScanState] = useState<"idle" | "scanning" | "success" | "failed">("idle");
  const [biometricProgress, setBiometricProgress] = useState(0);

  const startBiometricLogin = (role: "doctor" | "admin") => {
    setBiometricRole(role);
    setBiometricScanState("scanning");
    setBiometricProgress(0);

    let currentProg = 0;
    const interval = setInterval(() => {
      currentProg += 8;
      if (currentProg > 100) currentProg = 100;
      setBiometricProgress(currentProg);

      if (currentProg >= 100) {
        clearInterval(interval);
        setBiometricScanState("success");
        
        try {
          const textToSpeak = role === "doctor"
            ? "Biometric identity verified. Welcome back doctor."
            : "Administrator biometric security clearance approved. Welcome.";
          const speechMsg = new SpeechSynthesisUtterance(textToSpeak);
          speechMsg.rate = 0.95;
          window.speechSynthesis.speak(speechMsg);
        } catch (e) {
          // Speak fallback
        }

        setTimeout(() => {
          if (role === "doctor") {
            onLoginSuccess({ role: "doctor", doctorId: selectedDoctorId || doctors[0]?.id });
          } else {
            onLoginSuccess({ role: "admin" });
          }
          setBiometricRole(null);
          setBiometricScanState("idle");
        }, 1200);
      }
    }, 120);
  };

  const handlePatientEntry = () => {
    onLoginSuccess({ role: "patient" });
  };

  const handleDoctorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setDoctorError("");

    if (!selectedDoctorId) {
      setDoctorError("Please select a doctor profile.");
      return;
    }

    // Passcode check
    if (doctorPin === "1234") {
      onLoginSuccess({ role: "doctor", doctorId: selectedDoctorId });
    } else {
      setDoctorError(
        language === "hi"
          ? "गलत पासकोड! कृपया '1234' दर्ज करें।"
          : language === "mr"
          ? "चुकीचा पासकोड! कृपया '1234' प्रविष्ट करा."
          : "Invalid Passcode. Please enter '1234' for demo validation."
      );
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");

    if (adminPin === "9999") {
      onLoginSuccess({ role: "admin" });
    } else {
      setAdminError(
        language === "hi"
          ? "गलत पासकोड! कृपया '9999' दर्ज करें।"
          : language === "mr"
          ? "चुकीचा पासकोड! कृपया '9999' प्रविष्ट करा."
          : "Invalid Passcode. Please enter '9999' for demo validation."
      );
    }
  };

  // Helper translations for LoginPortal specifically
  const localTranslation: Record<string, Record<string, string>> = {
    en: {
      selectRoleText: "Who is accessing the system today?",
      patientCardDesc: "Secure access to OPD queue, diagnostic records, and referral forecasts. Enter your mobile number or connect via ABHA ID.",
      doctorCardDesc: "WiFi-secured morning/evening clinic attendance logging, real-time prescription dispense, and patient referral.",
      adminCardDesc: "District healthcare indexes, automated pharmaceutical redistribution plans, and 30-day forecast models.",
      enterPatient: "Open Patient Dashboard",
      enterDoctor: "Verify & Launch Doctor Console",
      enterAdmin: "Verify & Open District Console",
      selectDocProfile: "Select On-Duty Doctor Profile",
      enterPasscode: "Enter Secure Passcode",
      demoPasscodeLabel: "Demo Passcode",
      wrongPasscode: "Invalid passcode. Please try again.",
      loginViaMobile: "Mobile + OTP Login",
      loginViaAbha: "ABHA ID Login",
      mobilePlaceholder: "Enter 10-digit mobile number",
      sendOtp: "Send 6-Digit OTP",
      sendingOtp: "Sending OTP...",
      otpPlaceholder: "Enter 6-digit OTP",
      verifyOtp: "Verify OTP & Enter",
      demoOtpLabel: "Demo OTP",
      abhaPlaceholder: "14-digit ABHA No. (XX-XXXX-XXXX-XXXX)",
      abhaPinLabel: "Enter 4-Digit ABHA PIN",
      connectAbha: "Secure ABHA Login",
      demoAbhaLabel: "Demo PIN",
      validating: "Validating Security Credentials..."
    },
    hi: {
      selectRoleText: "आज सिस्टम का उपयोग कौन कर रहा है?",
      patientCardDesc: "ओपीडी कतार, नैदानिक रिकॉर्ड और रेफरल पूर्वानुमानों तक सुरक्षित पहुंच। अपना मोबाइल नंबर दर्ज करें या आभा (ABHA) आईडी से जुड़ें।",
      doctorCardDesc: "वाईफाई-सत्यापित उपस्थिति प्रणाली, मरीजों का नुस्खा विवरण, और अस्पतालों के बीच आपातकालीन रेफ़रल प्रबंधन।",
      adminCardDesc: "जिला स्तर की आपूर्ति श्रृंखला पूर्वानुमान, गंभीर औषधि कमी चेतावनी, और स्वास्थ्य सूचकांक विश्लेषण।",
      enterPatient: "मरीज डैशबोर्ड खोलें",
      enterDoctor: "सत्यापित करें और डॉक्टर कंसोल खोलें",
      enterAdmin: "सत्यापित करें और जिला कंसोल खोलें",
      selectDocProfile: "ऑन-ड्यूटी डॉक्टर प्रोफ़ाइल चुनें",
      enterPasscode: "सुरक्षित पासकोड दर्ज करें",
      demoPasscodeLabel: "डेमो पासकोड",
      wrongPasscode: "गलत पासकोड। कृपया पुनः प्रयास करें।",
      loginViaMobile: "मोबाइल + ओटीपी लॉगिन",
      loginViaAbha: "आभा (ABHA) आईडी लॉगिन",
      mobilePlaceholder: "10-अंकीय मोबाइल नंबर दर्ज करें",
      sendOtp: "6-अंकीय ओटीपी भेजें",
      sendingOtp: "ओटीपी भेजा जा रहा है...",
      otpPlaceholder: "6-अंकीय ओटीपी दर्ज करें",
      verifyOtp: "ओटीपी सत्यापित करें और आगे बढ़ें",
      demoOtpLabel: "डेमो ओटीपी",
      abhaPlaceholder: "14-अंकीय आभा संख्या (XX-XXXX-XXXX-XXXX)",
      abhaPinLabel: "4-अंकीय आभा पिन दर्ज करें",
      connectAbha: "सुरक्षित आभा लॉगिन",
      demoAbhaLabel: "डेमो पिन",
      validating: "सुरक्षा क्रेडेंशियल सत्यापित हो रहे हैं..."
    },
    mr: {
      selectRoleText: "आज सिस्टम कोण वापरत आहे?",
      patientCardDesc: "ओपीडी रांग, वैद्यकीय नोंदी आणि रेफरल अंदाजांमध्ये सुरक्षित प्रवेश. तुमचा मोबाईल नंबर प्रविष्ट करा किंवा आभा (ABHA) आयडी द्वारे कनेक्ट करा.",
      doctorCardDesc: "वायफाय-सत्यापित उपस्थिती नोंदवणे, औषधोपचार लिहून देणे, आणि रुग्णालयांच्या दरम्यान रेफ़रल व्यवस्थापन करणे.",
      adminCardDesc: "जिल्हास्तरीय औषध पुरवठा साखळी अंदाज, साठा टंचाई इशारा आणि आरोग्य निर्देशांक विश्लेषण.",
      enterPatient: "रुग्ण डॅशबोर्ड उघडा",
      enterDoctor: "सत्यापित करा आणि डॉक्टर कन्सोल उघडा",
      enterAdmin: "सत्यापित करा आणि जिल्हा कन्सोल उघडा",
      selectDocProfile: "ऑन-ड्यूटी डॉक्टर प्रोफाइल निवडा",
      enterPasscode: "सुरक्षित पासकोड प्रविष्ट करा",
      demoPasscodeLabel: "डेमो पासकोड",
      wrongPasscode: "चुकीचा पासकोड. कृपया पुन्हा प्रयत्न करा.",
      loginViaMobile: "मोबाईल + ओटीपी लॉगिन",
      loginViaAbha: "आभा (ABHA) आयडी लॉगिन",
      mobilePlaceholder: "10-अंकी मोबाईल नंबर प्रविष्ट करा",
      sendOtp: "6-अंकी ओटीपी पाठवा",
      sendingOtp: "ओटीपी पाठवला जात आहे...",
      otpPlaceholder: "6-अंकी ओटीपी प्रविष्ट करा",
      verifyOtp: "ओटीपी सत्यापित करा आणि पुढे जा",
      demoOtpLabel: "डेमो ओटीपी",
      abhaPlaceholder: "14-अंकी आभा क्रमांक (XX-XXXX-XXXX-XXXX)",
      abhaPinLabel: "4-अंकी आभा पिन प्रविष्ट करा",
      connectAbha: "सुरक्षित आभा लॉगिन",
      demoAbhaLabel: "डेमो पिन",
      validating: "सुरक्षा क्रेडेन्शियल सत्यापित केले जात आहेत..."
    }
  };

  const lt = localTranslation[language] || localTranslation.en;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-16 flex flex-col justify-center min-h-[80vh]" id="login-portal-container">
      
      {/* Inactivity Security Warn banner */}
      {logoutNotice === "inactivity" && (
        <div className="max-w-md w-full mx-auto mb-8 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-md animate-fadeIn" id="inactivity-warning-banner">
          <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5 animate-bounce" />
          <div className="text-xs">
            <h5 className="font-extrabold text-amber-900">
              {language === "hi" ? "सुरक्षा कारणों से सत्र समाप्त" : language === "mr" ? "सुरक्षा कारणास्तव सत्र समाप्त" : "Session Expired"}
            </h5>
            <p className="text-amber-800 mt-1 leading-relaxed">
              {language === "hi"
                ? "15 मिनट की निष्क्रियता के कारण जिला सुरक्षा मानकों के तहत आपका सत्र समाप्त कर दिया गया है। कृपया फिर से लॉग इन करें।"
                : language === "mr"
                ? "15 मिनिटांच्या निष्क्रियतेमुळे जिल्हा सुरक्षा मानकांवर आधारित तुमचे सत्र समाप्त केले आहे. कृपया पुन्हा लॉगिन करा."
                : "You have been logged out due to 15 minutes of inactivity under district health data security standards. Please log in again."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setLogoutNotice?.(null)}
            className="text-amber-500 hover:text-amber-700 font-extrabold text-sm ml-auto cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Brand Header */}
      <div className="text-center mb-8 sm:mb-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-3xl shadow-xl shadow-indigo-600/25 mb-4"
        >
          <HeartPulse className="h-9 w-9" />
        </motion.div>
        
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
          MED-INTEL CONNECT
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto font-medium">
          {t.subtitle}
        </p>

        {/* Language Selection inside portal */}
        <div className="mt-4 flex items-center justify-center gap-1.5 bg-white border border-slate-200 rounded-2xl p-1.5 px-3 shadow-xs inline-flex mx-auto">
          <Globe className="h-4 w-4 text-slate-400" />
          <select
            id="login-language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value as "en" | "hi" | "mr")}
            className="bg-transparent text-xs text-slate-600 outline-none font-bold cursor-pointer py-0.5 border-0 focus:ring-0"
          >
            <option value="en">English (US)</option>
            <option value="hi">हिन्दी (IN)</option>
            <option value="mr">मराठी (IN)</option>
          </select>
        </div>
      </div>

      {/* Role Selection Tabs */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-100 p-2 gap-1">
          <button
            id="login-tab-patient"
            type="button"
            onClick={() => setActiveRole("patient")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3.5 px-2 rounded-2xl text-xs font-bold transition cursor-pointer ${
              activeRole === "patient"
                ? "bg-white text-indigo-600 shadow-sm border border-slate-200/50"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <User className="h-4 w-4 shrink-0" />
            <span>{t.patientRole}</span>
          </button>
          
          <button
            id="login-tab-doctor"
            type="button"
            onClick={() => {
              setActiveRole("doctor");
              if (!selectedDoctorId && doctors.length > 0) {
                setSelectedDoctorId(doctors[0].id);
              }
            }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3.5 px-2 rounded-2xl text-xs font-bold transition cursor-pointer ${
              activeRole === "doctor"
                ? "bg-white text-indigo-600 shadow-sm border border-slate-200/50"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Stethoscope className="h-4 w-4 shrink-0" />
            <span>{t.doctorRole}</span>
          </button>

          <button
            id="login-tab-admin"
            type="button"
            onClick={() => setActiveRole("admin")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3.5 px-2 rounded-2xl text-xs font-bold transition cursor-pointer ${
              activeRole === "admin"
                ? "bg-white text-indigo-600 shadow-sm border border-slate-200/50"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>{t.adminRole}</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-10">
          
          {biometricRole ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto py-8 text-center space-y-6 flex flex-col items-center justify-center font-sans"
            >
              <div className="relative flex items-center justify-center">
                {/* Glowing pulse rings */}
                <span className="absolute inline-flex h-24 w-24 rounded-full bg-indigo-500/10 animate-ping"></span>
                <span className="absolute inline-flex h-32 w-32 rounded-full bg-teal-500/5 animate-pulse"></span>
                
                <div className="relative h-20 w-20 bg-slate-900 border-2 border-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  {biometricScanState === "scanning" ? (
                    <Fingerprint className="h-10 w-10 text-teal-400 animate-pulse" />
                  ) : (
                    <ScanFace className="h-10 w-10 text-emerald-400 animate-bounce" />
                  )}
                  {/* High-tech scanner laser line */}
                  {biometricScanState === "scanning" && (
                    <div className="absolute inset-x-0 h-0.5 bg-red-500 shadow-md shadow-red-500/80 animate-bounce top-1/2"></div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-800 tracking-tight">
                  {biometricScanState === "scanning" 
                    ? "BIOMETRIC AUTHENTICATION" 
                    : "CLEARANCE AUTHORIZED!"}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {biometricScanState === "scanning"
                    ? `Place finger on clinic pad or align face with the camera scanner...`
                    : "Identity securely verified with local central directory. Initializing shift dashboard..."}
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-xs space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-slate-400 font-bold">
                  <span>SCANNING SEQUENCE</span>
                  <span>{biometricProgress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 transition-all duration-100" 
                    style={{ width: `${biometricProgress}%` }}
                  ></div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setBiometricRole(null)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold border border-slate-200 rounded-lg px-3 py-1 cursor-pointer hover:bg-slate-50"
              >
                Cancel Biometric Check
              </button>
            </motion.div>
          ) : (
            <>
              {/* Patient Access Tab */}
              {activeRole === "patient" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 text-left max-w-md mx-auto"
                >
                  <div className="text-center space-y-2 mb-4">
                    <h3 className="text-xl font-bold text-slate-800 font-sans">
                      {t.patientRole}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {lt.patientCardDesc}
                    </p>
                  </div>

                  {/* Sub-tabs for Patient Authentication Method */}
                  <div className="flex bg-slate-100 p-1 rounded-xl mb-4 gap-1 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        setPatientAuthMethod("mobile");
                        setOtpError("");
                      }}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        patientAuthMethod === "mobile"
                          ? "bg-white text-indigo-600 shadow-xs border border-slate-200/50"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>{lt.loginViaMobile}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPatientAuthMethod("abha");
                        setAbhaError("");
                      }}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        patientAuthMethod === "abha"
                          ? "bg-white text-indigo-600 shadow-xs border border-slate-200/50"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <IdCard className="h-3.5 w-3.5" />
                      <span>{lt.loginViaAbha}</span>
                    </button>
                  </div>

                  {/* MOBILE AUTHENTICATION METHOD */}
                  {patientAuthMethod === "mobile" && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      {!otpSent ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                              {language === "hi" ? "अपना मोबाइल नंबर" : language === "mr" ? "तुमचा मोबाईल नंबर" : "Your Mobile Number"}
                            </label>
                            <div className="relative">
                              <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-bold border-r border-slate-200 pr-2 pt-0.5">
                                +91
                              </span>
                              <input
                                id="patient-phone-input"
                                type="tel"
                                required
                                value={patientPhone}
                                onChange={(e) => {
                                  const clean = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                                  setPatientPhone(clean);
                                }}
                                placeholder={lt.mobilePlaceholder}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-16 pr-4 py-2.5 text-sm font-semibold tracking-wide outline-none focus:border-indigo-500 focus:bg-white transition"
                              />
                            </div>
                          </div>

                          {otpError && (
                            <div className="p-3 bg-red-50 border border-red-150 text-red-600 rounded-xl text-xs flex items-start gap-2 font-medium">
                              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                              <span>{otpError}</span>
                            </div>
                          )}

                          <button
                            id="patient-send-otp-btn"
                            type="button"
                            onClick={handleSendOtp}
                            disabled={otpSending}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition shadow-md shadow-indigo-600/10 cursor-pointer flex items-center justify-center gap-2"
                          >
                            {otpSending ? (
                              <>
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>{lt.sendingOtp}</span>
                              </>
                            ) : (
                              <>
                                <Send className="h-3.5 w-3.5" />
                                <span>{lt.sendOtp}</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handlePatientMobileLogin} className="space-y-4">
                          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-800 flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold">{language === "hi" ? "ओटीपी भेजा गया!" : language === "mr" ? "ओटीपी पाठवला!" : "OTP Sent Successfully!"}</p>
                              <p className="mt-0.5 text-[11px] opacity-90">
                                {language === "hi" 
                                  ? `हमने +91 ${patientPhone.slice(0,6)}**** पर कूटशब्द भेजा है।` 
                                  : language === "mr" 
                                  ? `आम्ही +91 ${patientPhone.slice(0,6)}**** वर कोड पाठवला आहे.` 
                                  : `We sent a temporary passcode to +91 ${patientPhone.slice(0,6)}****.`}
                              </p>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                              {language === "hi" ? "एकमुश्त पासवर्ड दर्ज करें" : language === "mr" ? "ओटीपी प्रविष्ट करा" : "Enter Verification Code"}
                            </label>
                            <div className="relative">
                              <input
                                id="patient-otp-input"
                                type="text"
                                required
                                value={patientOtp}
                                onChange={(e) => {
                                  const clean = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
                                  setPatientOtp(clean);
                                }}
                                placeholder={lt.otpPlaceholder}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono tracking-widest outline-none focus:border-indigo-500 focus:bg-white transition"
                              />
                              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                            </div>
                          </div>

                          {otpError && (
                            <div className="p-3 bg-red-50 border border-red-150 text-red-600 rounded-xl text-xs flex items-start gap-2 font-medium">
                              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                              <span>{otpError}</span>
                            </div>
                          )}

                          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 text-[11px] text-indigo-700 font-medium">
                            💡 {lt.demoOtpLabel}: <strong className="font-bold font-mono bg-white px-1.5 py-0.5 rounded border border-indigo-200/50">123456</strong>
                          </div>

                          <button
                            id="patient-verify-otp-btn"
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition shadow-md shadow-indigo-600/10 cursor-pointer flex items-center justify-center gap-2"
                          >
                            <span>{lt.verifyOtp}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setOtpSent(false);
                              setPatientOtp("");
                              setOtpError("");
                            }}
                            className="w-full text-center text-xs text-slate-400 hover:text-slate-600 font-bold transition py-1 cursor-pointer"
                          >
                            {language === "hi" ? "← मोबाइल नंबर बदलें" : language === "mr" ? "← मोबाईल नंबर बदला" : "← Change Mobile Number"}
                          </button>
                        </form>
                      )}
                    </motion.div>
                  )}

                  {/* ABHA ID AUTHENTICATION METHOD */}
                  {patientAuthMethod === "abha" && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <form onSubmit={handlePatientAbhaLogin} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                            {language === "hi" ? "आभा संख्या या आभा पता" : language === "mr" ? "आभा क्रमांक किंवा आभा पत्ता" : "ABHA Number or ABHA Address"}
                          </label>
                          <div className="relative">
                            <input
                              id="patient-abha-id-input"
                              type="text"
                              required
                              value={abhaId}
                              onChange={(e) => handleAbhaChange(e.target.value)}
                              placeholder={lt.abhaPlaceholder}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold outline-none focus:border-indigo-500 focus:bg-white transition"
                            />
                            <IdCard className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                            {lt.abhaPinLabel}
                          </label>
                          <div className="relative">
                            <input
                              id="patient-abha-pin-input"
                              type="password"
                              required
                              value={abhaPin}
                              onChange={(e) => setAbhaPin(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
                              placeholder="••••"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono tracking-widest outline-none focus:border-indigo-500 focus:bg-white transition"
                            />
                            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                          </div>
                        </div>

                        {abhaError && (
                          <div className="p-3 bg-red-50 border border-red-150 text-red-600 rounded-xl text-xs flex items-start gap-2 font-medium">
                            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                            <span>{abhaError}</span>
                          </div>
                        )}

                        <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 text-[11px] text-indigo-700 font-medium">
                          💡 {lt.demoAbhaLabel}: <strong className="font-bold font-mono bg-white px-1.5 py-0.5 rounded border border-indigo-200/50">1234</strong>
                        </div>

                        <button
                          id="patient-abha-submit-btn"
                          type="submit"
                          disabled={abhaValidating}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition shadow-md shadow-indigo-600/10 cursor-pointer flex items-center justify-center gap-2"
                        >
                          {abhaValidating ? (
                            <>
                              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>{lt.validating}</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="h-4 w-4" />
                              <span>{lt.connectAbha}</span>
                            </>
                          )}
                        </button>
                      </form>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Doctor Login Tab */}
              {activeRole === "doctor" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-md mx-auto space-y-6"
                >
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-slate-800 font-sans">
                      {t.doctorRole}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {lt.doctorCardDesc}
                    </p>
                  </div>

                  <form onSubmit={handleDoctorLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        {lt.selectDocProfile}
                      </label>
                      <select
                        id="doctor-login-select"
                        value={selectedDoctorId}
                        onChange={(e) => setSelectedDoctorId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition cursor-pointer font-semibold"
                      >
                        {doctors.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.specialty})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        {lt.enterPasscode}
                      </label>
                      <div className="relative">
                        <input
                          id="doctor-passcode-input"
                          type="password"
                          required
                          value={doctorPin}
                          onChange={(e) => setDoctorPin(e.target.value)}
                          placeholder="••••"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono tracking-widest outline-none focus:border-indigo-500 focus:bg-white transition"
                        />
                        <KeyRound className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
                      </div>
                    </div>

                    {doctorError && (
                      <div className="p-3 bg-red-50 border border-red-150 text-red-600 rounded-xl text-xs flex items-start gap-2 font-medium">
                        <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>{doctorError}</span>
                      </div>
                    )}

                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 text-[11px] text-indigo-700 font-medium">
                      💡 {lt.demoPasscodeLabel}: <strong className="font-bold font-mono bg-white px-1.5 py-0.5 rounded border border-indigo-200/50">1234</strong>
                    </div>

                    <button
                      id="doctor-login-submit"
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition shadow-md shadow-indigo-600/10 cursor-pointer"
                    >
                      {lt.enterDoctor}
                    </button>

                    <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-slate-200"></div>
                      <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-widest font-mono">OR BIOMETRICS</span>
                      <div className="flex-grow border-t border-slate-200"></div>
                    </div>

                    <button
                      type="button"
                      onClick={() => startBiometricLogin("doctor")}
                      className="w-full bg-slate-900 hover:bg-slate-950 text-white font-extrabold py-3.5 px-4 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer border border-slate-800 font-mono tracking-wider"
                    >
                      <Fingerprint className="h-4 w-4 text-emerald-400 animate-pulse" />
                      <span>TOUCH FINGERPRINT / FACE ID</span>
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Administrator Login Tab */}
              {activeRole === "admin" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-md mx-auto space-y-6"
                >
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-slate-800 font-sans">
                      {t.adminRole}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {lt.adminCardDesc}
                    </p>
                  </div>

                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        {lt.enterPasscode}
                      </label>
                      <div className="relative">
                        <input
                          id="admin-passcode-input"
                          type="password"
                          required
                          value={adminPin}
                          onChange={(e) => setAdminPin(e.target.value)}
                          placeholder="••••"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono tracking-widest outline-none focus:border-indigo-500 focus:bg-white transition"
                        />
                        <KeyRound className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
                      </div>
                    </div>

                    {adminError && (
                      <div className="p-3 bg-red-50 border border-red-150 text-red-600 rounded-xl text-xs flex items-start gap-2 font-medium">
                        <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>{adminError}</span>
                      </div>
                    )}

                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 text-[11px] text-indigo-700 font-medium">
                      💡 {lt.demoPasscodeLabel}: <strong className="font-bold font-mono bg-white px-1.5 py-0.5 rounded border border-indigo-200/50">9999</strong>
                    </div>

                    <button
                      id="admin-login-submit"
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition shadow-md shadow-indigo-600/10 cursor-pointer"
                    >
                      {lt.enterAdmin}
                    </button>

                    <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-slate-200"></div>
                      <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-widest font-mono">OR BIOMETRICS</span>
                      <div className="flex-grow border-t border-slate-200"></div>
                    </div>

                    <button
                      type="button"
                      onClick={() => startBiometricLogin("admin")}
                      className="w-full bg-slate-900 hover:bg-slate-950 text-white font-extrabold py-3.5 px-4 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer border border-slate-800 font-mono tracking-wider"
                    >
                      <Fingerprint className="h-4 w-4 text-emerald-400 animate-pulse" />
                      <span>SCAN FINGERPRINT / FACE ID</span>
                    </button>
                  </form>
                </motion.div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};
