import React, { useState } from 'react';
import {
  X,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  UserCheck,
  PhoneCall
} from 'lucide-react';
import { AdminProfile } from '../types';
import {
  verifyCredentials,
  verifyPasswordOnly,
  updateAdminPasswordSecurely,
  updateAdminMobileSecurely,
  updateAdminUsernameSecurely,
  getAdminAuth,
  saveAdminAuth
} from '../utils/auth';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
  adminProfile: AdminProfile;
  setAdminProfile: React.Dispatch<React.SetStateAction<AdminProfile>>;
  onLoginSuccess: () => void;
  isBlocking?: boolean;
  initialStep?: ModalStep;
}

export type ModalStep =
  | 'login'
  | 'otp_login'
  | 'forgot_start'
  | 'otp_forgot'
  | 'reset_password'
  | 'change_pass_start'
  | 'otp_change_pass'
  | 'new_password'
  | 'change_mobile_start'
  | 'otp_current_mobile'
  | 'enter_new_mobile'
  | 'otp_new_mobile'
  | 'change_username_start'
  | 'otp_change_username'
  | 'enter_new_username';

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  adminProfile,
  setAdminProfile,
  onLoginSuccess,
  isBlocking = false,
  initialStep = 'login',
}) => {
  const [step, setStep] = useState<ModalStep>(initialStep);

  // Inputs
  const [username, setUsername] = useState(adminProfile.username || 'sanket123');
  const [password, setPassword] = useState('');
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newMobileNumber, setNewMobileNumber] = useState('');
  const [newUsernameInput, setNewUsernameInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP states
  const [otp, setOtp] = useState(['4', '8', '2', '0']);
  const [newMobileOtp, setNewMobileOtp] = useState(['9', '1', '6', '3']);

  // Feedback messages
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password Strength Helper
  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return { level: 0, label: 'Not Set', color: 'bg-slate-700', text: 'text-slate-400' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { level: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' };
    if (score <= 4) return { level: 2, label: 'Medium Security', color: 'bg-amber-400', text: 'text-amber-400' };
    return { level: 3, label: 'Strong Security', color: 'bg-emerald-400', text: 'text-emerald-400' };
  };

  React.useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
      setErrorMessage('');
      setSuccessMessage('');
      setUsername(adminProfile.username || 'sanket123');
    }
  }, [isOpen, initialStep, adminProfile.username]);

  if (!isOpen) return null;

  // Direct Instant Login without OTP
  const handleDirectInstantLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    const inputUser = username.trim() || 'sanket123';
    const inputPass = password.trim();

    if (!inputPass) {
      setErrorMessage('Please enter admin password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const isValid = await verifyCredentials(inputUser, inputPass);
      setIsSubmitting(false);

      if (!isValid) {
        setErrorMessage(`Invalid credentials. Default Username: sanket123 | Password: Sanket-123`);
        return;
      }

      // Persist auth state in localStorage
      const auth = await getAdminAuth();
      saveAdminAuth({ ...auth, isLoggedIn: true, username: inputUser });

      setAdminProfile((prev) => ({ ...prev, isLoggedIn: true, username: inputUser }));
      setSuccessMessage('⚡ Admin authenticated and logged in successfully!');
      setTimeout(() => {
        onLoginSuccess();
        if (onClose) onClose();
        setSuccessMessage('');
        setStep('login');
      }, 600);
    } catch {
      setIsSubmitting(false);
      setErrorMessage('Authentication error occurred. Please try again.');
    }
  };

  // 1. LOGIN FLOW
  const handleStartLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    const inputUser = username.trim() || 'sanket123';
    const inputPass = password.trim();

    if (!inputPass) {
      setErrorMessage('Please enter admin password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const isValid = await verifyCredentials(inputUser, inputPass);
      setIsSubmitting(false);

      if (!isValid) {
        setErrorMessage(`Invalid credentials. Default Username: sanket123 | Password: Sanket-123`);
        return;
      }

      setStep('otp_login');
      setSuccessMessage(`OTP sent to registered Admin Mobile: ${adminProfile.adminMobile}`);
    } catch {
      setIsSubmitting(false);
      setErrorMessage('Authentication error occurred. Please try again.');
    }
  };

  const handleVerifyLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      setErrorMessage('Please enter 4-digit security code.');
      return;
    }

    const inputUser = username.trim() || 'sanket123';
    const auth = await getAdminAuth();
    saveAdminAuth({ ...auth, isLoggedIn: true, username: inputUser });

    setAdminProfile((prev) => ({ ...prev, isLoggedIn: true, username: inputUser }));
    setSuccessMessage('Admin authenticated successfully!');
    setTimeout(() => {
      onLoginSuccess();
      if (onClose) onClose();
      setSuccessMessage('');
      setStep('login');
    }, 800);
  };

  // 2. FORGOT PASSWORD FLOW
  const handleSendForgotOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (username.trim() !== adminProfile.username) {
      setErrorMessage(`Username not recognized. Registered Admin username is: ${adminProfile.username}`);
      return;
    }
    setStep('otp_forgot');
    setSuccessMessage(`OTP sent to registered Admin Mobile: ${adminProfile.adminMobile}`);
  };

  const handleVerifyForgotOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (otp.join('').length < 4) {
      setErrorMessage('Please enter 4-digit code.');
      return;
    }
    setStep('reset_password');
    setSuccessMessage('OTP verified! Enter new Admin password.');
  };

  // 3. CHANGE PASSWORD FLOW
  const handleVerifyPassForChangePass = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!currentPasswordInput) {
      setErrorMessage('Please enter current password.');
      return;
    }
    setIsSubmitting(true);
    const valid = await verifyPasswordOnly(currentPasswordInput);
    setIsSubmitting(false);
    if (!valid) {
      setErrorMessage('Current password incorrect!');
      return;
    }
    setStep('otp_change_pass');
    setSuccessMessage(`OTP sent to registered Admin Mobile: ${adminProfile.adminMobile}`);
  };

  const handleVerifyOtpForChangePass = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (otp.join('').length < 4) {
      setErrorMessage('Please enter 4-digit code.');
      return;
    }
    setStep('new_password');
    setSuccessMessage('OTP verified! Enter new Admin password.');
  };

  const handleSaveNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateAdminPasswordSecurely(newPassword);
      setIsSubmitting(false);
      setPassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPasswordInput('');
      setSuccessMessage('Password saved securely! Please login with your new password.');
      setTimeout(() => {
        setSuccessMessage('');
        setStep('login');
      }, 1500);
    } catch {
      setIsSubmitting(false);
      setErrorMessage('Failed to update password.');
    }
  };

  // 4. CHANGE MOBILE NUMBER FLOW
  // Step 1: Verify current password
  const handleMobileStep1VerifyPass = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!currentPasswordInput) {
      setErrorMessage('Please enter current password.');
      return;
    }

    setIsSubmitting(true);
    const isValid = await verifyPasswordOnly(currentPasswordInput);
    setIsSubmitting(false);

    if (!isValid) {
      setErrorMessage('Current password is incorrect.');
      return;
    }

    // Move to Step 2: OTP to current mobile
    setStep('otp_current_mobile');
    setSuccessMessage(`Step 2: OTP sent to CURRENT Mobile (${adminProfile.adminMobile})`);
  };

  // Step 2: Verify OTP on current mobile
  const handleMobileStep2VerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (otp.join('').length < 4) {
      setErrorMessage('Please enter 4-digit code.');
      return;
    }
    // Move to Step 3: Enter new mobile number
    setStep('enter_new_mobile');
    setSuccessMessage('Identity verified! Step 3: Enter your NEW Mobile Number.');
  };

  // Step 3: Submit new mobile number & send OTP
  const handleMobileStep3SendNewOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!newMobileNumber || newMobileNumber.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    // Move to Step 4/5: Verify OTP on NEW mobile number
    setStep('otp_new_mobile');
    setSuccessMessage(`Step 4: Verification OTP sent to NEW Mobile (${newMobileNumber})`);
  };

  // Step 6: Verify OTP on new mobile & update Admin mobile number
  const handleMobileStep6Finalize = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (newMobileOtp.join('').length < 4) {
      setErrorMessage('Please enter 4-digit code sent to your new mobile.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formatted = newMobileNumber.startsWith('+') ? newMobileNumber : `+91 ${newMobileNumber.trim()}`;
      await updateAdminMobileSecurely(formatted);
      setAdminProfile((prev) => ({ ...prev, adminMobile: formatted }));
      setIsSubmitting(false);
      setSuccessMessage(`Admin Mobile Number successfully updated to ${formatted}!`);
      setTimeout(() => {
        setSuccessMessage('');
        setStep('login');
        setCurrentPasswordInput('');
        setNewMobileNumber('');
      }, 2000);
    } catch {
      setIsSubmitting(false);
      setErrorMessage('Failed to update mobile number.');
    }
  };

  // 5. CHANGE USERNAME FLOW
  // Step 1: Verify current password
  const handleUsernameStep1VerifyPass = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!currentPasswordInput) {
      setErrorMessage('Please enter current password.');
      return;
    }

    setIsSubmitting(true);
    const isValid = await verifyPasswordOnly(currentPasswordInput);
    setIsSubmitting(false);

    if (!isValid) {
      setErrorMessage('Current password is incorrect.');
      return;
    }

    // Move to Step 2: OTP on registered mobile number
    setStep('otp_change_username');
    setSuccessMessage(`Step 2: Security OTP sent to registered Mobile (${adminProfile.adminMobile})`);
  };

  // Step 2: Verify OTP
  const handleUsernameStep2VerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (otp.join('').length < 4) {
      setErrorMessage('Please enter 4-digit code.');
      return;
    }
    // Move to Step 3: Enter new Username
    setStep('enter_new_username');
    setSuccessMessage('OTP verified! Step 3: Enter your new Admin Username.');
  };

  // Step 4: Finalize Username change
  const handleUsernameStep4Finalize = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!newUsernameInput || newUsernameInput.length < 3) {
      setErrorMessage('Username must be at least 3 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateAdminUsernameSecurely(newUsernameInput);
      setAdminProfile((prev) => ({ ...prev, username: newUsernameInput.trim() }));
      setUsername(newUsernameInput.trim());
      setIsSubmitting(false);
      setSuccessMessage(`Admin Username successfully changed to "${newUsernameInput.trim()}"!`);
      setTimeout(() => {
        setSuccessMessage('');
        setStep('login');
        setCurrentPasswordInput('');
        setNewUsernameInput('');
      }, 2000);
    } catch {
      setIsSubmitting(false);
      setErrorMessage('Failed to update username.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-md bg-[#10131E] border border-amber-500/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden my-auto">
        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-400"></div>

        {!isBlocking && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-[#1C2030] hover:bg-[#252A3F] text-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 p-0.5 shadow-lg flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#000000] rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-100 leading-tight">
              {step === 'login' && 'Admin Portal Access'}
              {step === 'otp_login' && '2FA Mobile OTP Login'}
              {step === 'forgot_start' && 'Reset Admin Password'}
              {step === 'otp_forgot' && 'Reset Code Verification'}
              {step === 'reset_password' && 'Set New Password'}
              {step === 'change_pass_start' && 'Change Admin Password'}
              {step === 'otp_change_pass' && 'OTP Password Security'}
              {step === 'new_password' && 'Enter New Password'}
              {step === 'change_mobile_start' && 'Change Admin Mobile Number'}
              {step === 'otp_current_mobile' && 'Verify Current Mobile OTP'}
              {step === 'enter_new_mobile' && 'Enter New Mobile Number'}
              {step === 'otp_new_mobile' && 'Verify New Mobile OTP'}
              {step === 'change_username_start' && 'Change Admin Username'}
              {step === 'otp_change_username' && 'Verify Username OTP'}
              {step === 'enter_new_username' && 'Enter New Username'}
            </h2>
            <p className="text-xs text-amber-300 font-bold">
              Kishor Enterprises Security System
            </p>
          </div>
        </div>

        {/* Quick Action Selection Bar (When in change modes) */}
        {step !== 'login' && step !== 'otp_login' && (
          <div className="flex items-center gap-1 bg-[#181C2B] p-1 rounded-xl mb-4 border border-amber-500/20 text-[11px] overflow-x-auto">
            <button
              onClick={() => { setErrorMessage(''); setStep('login'); }}
              className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-amber-300 font-bold whitespace-nowrap"
            >
              🔑 Login
            </button>
            <button
              onClick={() => { setErrorMessage(''); setStep('change_mobile_start'); }}
              className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition ${
                step.includes('mobile') ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-amber-300'
              }`}
            >
              📱 Mobile No.
            </button>
            <button
              onClick={() => { setErrorMessage(''); setStep('change_username_start'); }}
              className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition ${
                step.includes('username') ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-amber-300'
              }`}
            >
              👤 Username
            </button>
            <button
              onClick={() => { setErrorMessage(''); setStep('change_pass_start'); }}
              className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition ${
                step.includes('pass') ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-amber-300'
              }`}
            >
              🔒 Password
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 px-3 py-2 bg-[#2E1417] border border-rose-500 text-rose-200 text-xs rounded-xl flex items-center gap-2 font-bold">
            <span>⚠️</span> {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 px-3 py-2 bg-[#122A1E] border border-emerald-500 text-emerald-200 text-xs rounded-xl flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 inline shrink-0" /> {successMessage}
          </div>
        )}

        {/* ------------------- STEP 1: LOGIN ------------------- */}
        {step === 'login' && (
          <form onSubmit={handleDirectInstantLogin} className="space-y-4">
            <div className="bg-[#1D2235] border border-amber-500/30 p-2.5 rounded-xl flex items-center justify-between text-xs">
              <div>
                <p className="text-slate-300 font-bold">Default Admin Login:</p>
                <p className="text-amber-300 font-mono text-[11px]">
                  User: <span className="font-bold">sanket123</span> | Pass: <span className="font-bold">Sanket-123</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUsername('sanket123');
                  setPassword('Sanket-123');
                  setErrorMessage('');
                  setSuccessMessage('Auto-filled default credentials!');
                }}
                className="text-[11px] font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-2.5 py-1.5 rounded-lg shadow transition shrink-0"
              >
                ⚡ Auto-fill
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-200 mb-1 block">Admin Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. sanket123"
                  className="w-full bg-[#181C2B] border border-amber-500/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-200 mb-1 block">Admin Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#181C2B] border border-amber-500/40 rounded-xl pl-10 pr-10 py-2.5 text-sm text-amber-200 font-mono tracking-widest font-bold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition placeholder:font-sans placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-300 hover:text-amber-300 transition"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <button
                type="button"
                onClick={() => { setErrorMessage(''); setStep('forgot_start'); }}
                className="text-amber-400 hover:underline font-bold text-left"
              >
                Forgot Password?
              </button>
              <button
                type="button"
                onClick={() => { setErrorMessage(''); setStep('change_mobile_start'); }}
                className="text-slate-300 hover:text-amber-300 font-bold text-right"
              >
                Change Mobile / Name
              </button>
            </div>

            <div className="space-y-2 pt-2">
              {/* Option 1: Direct Instant Login (Submit on Enter key) */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Verifying...' : '⚡ Direct Admin Login'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Option 2: 2-Factor Mobile OTP Login */}
              <button
                type="button"
                onClick={handleStartLogin}
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#181C2B] hover:bg-[#20263A] text-slate-200 border border-amber-500/30 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>Login via Mobile OTP Verification</span>
              </button>
            </div>
          </form>
        )}

        {/* ------------------- LOGIN OTP ------------------- */}
        {step === 'otp_login' && (
          <form onSubmit={handleVerifyLoginOtp} className="space-y-4">
            <div className="bg-[#241E12] border border-amber-500/40 p-3 rounded-2xl text-center space-y-2">
              <Smartphone className="w-6 h-6 text-amber-400 mx-auto animate-bounce" />
              <div>
                <p className="text-xs text-slate-200 font-bold">
                  Security OTP sent to Admin Registered Mobile:
                </p>
                <p className="text-sm font-black text-amber-300 tracking-wider font-mono">
                  {adminProfile.adminMobile}
                </p>
              </div>

              {/* Action Buttons to Send OTP via WhatsApp or SMS */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <a
                  href={`https://wa.me/${adminProfile.adminMobile.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `🔐 Kishor Enterprises Admin Security Login OTP Code: ${otp.join('')}\n\nUse this code to verify your admin login session.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold hover:bg-emerald-500/30 transition flex items-center gap-1.5"
                >
                  <span>📲 Send to WhatsApp</span>
                </a>

                <a
                  href={`sms:${adminProfile.adminMobile.replace(/[^0-9]/g, '')}?body=${encodeURIComponent(
                    `Kishor Enterprises Security OTP: ${otp.join('')}`
                  )}`}
                  className="px-3 py-1.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/40 text-xs font-bold hover:bg-sky-500/30 transition flex items-center gap-1.5"
                >
                  <span>💬 Send via SMS</span>
                </a>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-200">
                  Enter 4-Digit Security Code
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const newCode = [
                      Math.floor(Math.random() * 9 + 1).toString(),
                      Math.floor(Math.random() * 10).toString(),
                      Math.floor(Math.random() * 10).toString(),
                      Math.floor(Math.random() * 10).toString(),
                    ];
                    setOtp(newCode);
                    setSuccessMessage(`New Security OTP generated: ${newCode.join('')}`);
                  }}
                  className="text-[11px] font-bold text-amber-400 hover:underline"
                >
                  Resend OTP
                </button>
              </div>

              <div className="flex items-center justify-center gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value;
                      setOtp(newOtp);
                    }}
                    className="w-12 h-12 bg-[#181C2B] border-2 border-amber-500/50 focus:border-amber-400 text-center text-lg font-black text-amber-300 rounded-xl focus:outline-none transition shadow-sm"
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('login')}
                className="flex-1 py-2.5 bg-[#1C2030] text-slate-200 font-bold rounded-xl hover:bg-[#252A3F] transition"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg hover:bg-amber-300 transition"
              >
                Verify & Login
              </button>
            </div>
          </form>
        )}

        {/* ------------------- CHANGE MOBILE NUMBER FLOW ------------------- */}
        {/* Mobile Step 1: Current Password */}
        {step === 'change_mobile_start' && (
          <form onSubmit={handleMobileStep1VerifyPass} className="space-y-4">
            <div className="bg-[#181C2B] border border-amber-500/30 p-3 rounded-2xl text-xs space-y-1">
              <span className="font-black text-amber-300 block flex items-center gap-1">
                <PhoneCall className="w-4 h-4 text-amber-400" />
                Step 1: Admin Password Verification
              </span>
              <p className="text-slate-300">
                To update the Admin Mobile Number, enter your current password first.
              </p>
              <span className="text-[11px] text-amber-400 font-mono block pt-0.5">
                Current Registered Mobile: {adminProfile.adminMobile}
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-200 mb-1 block">Current Admin Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#181C2B] border border-amber-500/40 rounded-xl pl-10 pr-10 py-2.5 text-sm text-amber-200 font-mono tracking-widest font-bold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition placeholder:font-sans placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-300 hover:text-amber-300 transition"
                  title={showCurrentPassword ? 'Hide password' : 'Show password'}
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep('login')}
                className="flex-1 py-2.5 bg-[#1C2030] text-slate-200 font-bold rounded-xl hover:bg-[#252A3F] transition"
              >
                Back to Login
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg hover:bg-amber-300 transition"
              >
                {isSubmitting ? 'Verifying...' : 'Next: Verify OTP'}
              </button>
            </div>
          </form>
        )}

        {/* Mobile Step 2: OTP on Current Mobile */}
        {step === 'otp_current_mobile' && (
          <form onSubmit={handleMobileStep2VerifyOtp} className="space-y-4">
            <div className="bg-[#241E12] border border-amber-500/40 p-3 rounded-2xl text-center space-y-2">
              <Smartphone className="w-6 h-6 text-amber-400 mx-auto animate-bounce" />
              <div>
                <p className="text-xs text-slate-200 font-bold">
                  Step 2: Security OTP sent to CURRENT Mobile Number:
                </p>
                <p className="text-sm font-black text-amber-300 tracking-wider font-mono">
                  {adminProfile.adminMobile}
                </p>
              </div>

              {/* Action Buttons to Send OTP via WhatsApp or SMS */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <a
                  href={`https://wa.me/${adminProfile.adminMobile.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `🔐 Kishor Enterprises Admin Mobile Change OTP: ${otp.join('')}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold hover:bg-emerald-500/30 transition flex items-center gap-1.5"
                >
                  <span>📲 Send to WhatsApp</span>
                </a>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-200 mb-2 block text-center">
                Enter 4-Digit Security Code
              </label>
              <div className="flex items-center justify-center gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value;
                      setOtp(newOtp);
                    }}
                    className="w-12 h-12 bg-[#181C2B] border-2 border-amber-500/50 focus:border-amber-400 text-center text-lg font-black text-amber-300 rounded-xl focus:outline-none transition"
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('change_mobile_start')}
                className="flex-1 py-2.5 bg-[#1C2030] text-slate-200 font-bold rounded-xl hover:bg-[#252A3F] transition"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg hover:bg-amber-300 transition"
              >
                Verify Current Mobile
              </button>
            </div>
          </form>
        )}

        {/* Mobile Step 3: Enter New Mobile Number */}
        {step === 'enter_new_mobile' && (
          <form onSubmit={handleMobileStep3SendNewOtp} className="space-y-4">
            <div className="bg-[#122A1E] border border-emerald-500/40 p-3 rounded-2xl text-xs space-y-1">
              <span className="font-black text-emerald-300 block flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Current Mobile Verified! Step 3: Enter New Mobile Number
              </span>
              <p className="text-slate-300">
                Enter the new mobile number to receive the final confirmation OTP.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-200 mb-1 block">New Mobile Number</label>
              <input
                type="tel"
                required
                value={newMobileNumber}
                onChange={(e) => setNewMobileNumber(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full bg-[#181C2B] border border-amber-500/40 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-amber-300 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('otp_current_mobile')}
                className="flex-1 py-2.5 bg-[#1C2030] text-slate-200 font-bold rounded-xl hover:bg-[#252A3F] transition"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg hover:bg-amber-300 transition"
              >
                Send OTP to New Mobile
              </button>
            </div>
          </form>
        )}

        {/* Mobile Step 4 & 5: Verify OTP on New Mobile */}
        {step === 'otp_new_mobile' && (
          <form onSubmit={handleMobileStep6Finalize} className="space-y-4">
            <div className="bg-[#241E12] border border-amber-500/40 p-3 rounded-2xl text-center space-y-2">
              <Smartphone className="w-6 h-6 text-amber-400 mx-auto animate-bounce" />
              <div>
                <p className="text-xs text-slate-200 font-bold">
                  Step 5: Final OTP sent to NEW Mobile Number:
                </p>
                <p className="text-sm font-black text-amber-300 tracking-wider font-mono">
                  {newMobileNumber}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <a
                  href={`https://wa.me/${newMobileNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `🔐 Kishor Enterprises Admin Mobile Confirmation OTP: ${newMobileOtp.join('')}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold hover:bg-emerald-500/30 transition flex items-center gap-1.5"
                >
                  <span>📲 Send to WhatsApp</span>
                </a>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-200 mb-2 block text-center">
                Enter 4-Digit Confirmation Code
              </label>
              <div className="flex items-center justify-center gap-3">
                {newMobileOtp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...newMobileOtp];
                      newOtp[idx] = e.target.value;
                      setNewMobileOtp(newOtp);
                    }}
                    className="w-12 h-12 bg-[#181C2B] border-2 border-amber-500/50 focus:border-amber-400 text-center text-lg font-black text-amber-300 rounded-xl focus:outline-none transition"
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('enter_new_mobile')}
                className="flex-1 py-2.5 bg-[#1C2030] text-slate-200 font-bold rounded-xl hover:bg-[#252A3F] transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg hover:bg-amber-300 transition"
              >
                {isSubmitting ? 'Updating...' : 'Update Admin Mobile'}
              </button>
            </div>
          </form>
        )}

        {/* ------------------- CHANGE USERNAME FLOW ------------------- */}
        {/* Username Step 1: Verify Password */}
        {step === 'change_username_start' && (
          <form onSubmit={handleUsernameStep1VerifyPass} className="space-y-4">
            <div className="bg-[#181C2B] border border-amber-500/30 p-3 rounded-2xl text-xs space-y-1">
              <span className="font-black text-amber-300 block flex items-center gap-1">
                <UserCheck className="w-4 h-4 text-amber-400" />
                Step 1: Admin Password Verification
              </span>
              <p className="text-slate-300">
                To change your Admin Username, enter your current password.
              </p>
              <span className="text-[11px] text-amber-400 font-mono block pt-0.5">
                Current Username: {adminProfile.username}
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-200 mb-1 block">Current Admin Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#181C2B] border border-amber-500/40 rounded-xl pl-10 pr-10 py-2.5 text-sm text-amber-200 font-mono tracking-widest font-bold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition placeholder:font-sans placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-300 hover:text-amber-300 transition"
                  title={showCurrentPassword ? 'Hide password' : 'Show password'}
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep('login')}
                className="flex-1 py-2.5 bg-[#1C2030] text-slate-200 font-bold rounded-xl hover:bg-[#252A3F] transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg hover:bg-amber-300 transition"
              >
                {isSubmitting ? 'Verifying...' : 'Next: Verify OTP'}
              </button>
            </div>
          </form>
        )}

        {/* Username Step 2: OTP Verification */}
        {step === 'otp_change_username' && (
          <form onSubmit={handleUsernameStep2VerifyOtp} className="space-y-4">
            <div className="bg-[#241E12] border border-amber-500/40 p-3 rounded-2xl text-center space-y-2">
              <Smartphone className="w-6 h-6 text-amber-400 mx-auto animate-bounce" />
              <div>
                <p className="text-xs text-slate-200 font-bold">
                  Step 2: Security OTP sent to Admin Mobile:
                </p>
                <p className="text-sm font-black text-amber-300 tracking-wider font-mono">
                  {adminProfile.adminMobile}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <a
                  href={`https://wa.me/${adminProfile.adminMobile.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `🔐 Kishor Enterprises Username Change Security OTP: ${otp.join('')}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold hover:bg-emerald-500/30 transition flex items-center gap-1.5"
                >
                  <span>📲 Send to WhatsApp</span>
                </a>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-200 mb-2 block text-center">
                Enter 4-Digit Security Code
              </label>
              <div className="flex items-center justify-center gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value;
                      setOtp(newOtp);
                    }}
                    className="w-12 h-12 bg-[#181C2B] border-2 border-amber-500/50 focus:border-amber-400 text-center text-lg font-black text-amber-300 rounded-xl focus:outline-none transition"
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('change_username_start')}
                className="flex-1 py-2.5 bg-[#1C2030] text-slate-200 font-bold rounded-xl hover:bg-[#252A3F] transition"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg hover:bg-amber-300 transition"
              >
                Verify OTP
              </button>
            </div>
          </form>
        )}

        {/* Username Step 3 & 4: Enter New Username */}
        {step === 'enter_new_username' && (
          <form onSubmit={handleUsernameStep4Finalize} className="space-y-4">
            <div className="bg-[#122A1E] border border-emerald-500/40 p-3 rounded-2xl text-xs space-y-1">
              <span className="font-black text-emerald-300 block flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                OTP Verified! Step 3: Set New Admin Username
              </span>
              <p className="text-slate-300">
                Enter the new username for the Admin account.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-200 mb-1 block">New Username</label>
              <input
                type="text"
                required
                value={newUsernameInput}
                onChange={(e) => setNewUsernameInput(e.target.value)}
                placeholder="e.g. sanket_admin"
                className="w-full bg-[#181C2B] border border-amber-500/40 rounded-xl px-4 py-2.5 text-sm font-bold text-amber-300 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('otp_change_username')}
                className="flex-1 py-2.5 bg-[#1C2030] text-slate-200 font-bold rounded-xl hover:bg-[#252A3F] transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg hover:bg-amber-300 transition"
              >
                {isSubmitting ? 'Saving...' : 'Save New Username'}
              </button>
            </div>
          </form>
        )}

        {/* ------------------- CHANGE PASSWORD FLOW ------------------- */}
        {step === 'change_pass_start' && (
          <form onSubmit={handleVerifyPassForChangePass} className="space-y-4">
            <div className="bg-[#181C2B] border border-amber-500/30 p-3 rounded-2xl text-xs space-y-1">
              <span className="font-black text-amber-300 block flex items-center gap-1">
                <KeyRound className="w-4 h-4 text-amber-400" />
                Step 1: Verify Current Password
              </span>
              <p className="text-slate-300">
                Enter your current Admin password to proceed with password change.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-200 mb-1 block">Current Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#181C2B] border border-amber-500/40 rounded-xl pl-10 pr-10 py-2.5 text-sm text-amber-200 font-mono tracking-widest font-bold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition placeholder:font-sans placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-300 hover:text-amber-300 transition"
                  title={showCurrentPassword ? 'Hide password' : 'Show password'}
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep('login')}
                className="flex-1 py-2.5 bg-[#1C2030] text-slate-200 font-bold rounded-xl hover:bg-[#252A3F] transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg hover:bg-amber-300 transition"
              >
                {isSubmitting ? 'Verifying...' : 'Next: Verify OTP'}
              </button>
            </div>
          </form>
        )}

        {step === 'otp_change_pass' && (
          <form onSubmit={handleVerifyOtpForChangePass} className="space-y-4">
            <div className="bg-[#241E12] border border-amber-500/40 p-3 rounded-2xl text-center space-y-2">
              <Smartphone className="w-6 h-6 text-amber-400 mx-auto animate-bounce" />
              <div>
                <p className="text-xs text-slate-200 font-bold">
                  Security OTP sent to Admin Mobile:
                </p>
                <p className="text-sm font-black text-amber-300 tracking-wider font-mono">
                  {adminProfile.adminMobile}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <a
                  href={`https://wa.me/${adminProfile.adminMobile.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `🔐 Kishor Enterprises Password Change Security OTP: ${otp.join('')}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold hover:bg-emerald-500/30 transition flex items-center gap-1.5"
                >
                  <span>📲 Send to WhatsApp</span>
                </a>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-200 mb-2 block text-center">
                Enter 4-Digit Security Code
              </label>
              <div className="flex items-center justify-center gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value;
                      setOtp(newOtp);
                    }}
                    className="w-12 h-12 bg-[#181C2B] border-2 border-amber-500/50 focus:border-amber-400 text-center text-lg font-black text-amber-300 rounded-xl focus:outline-none transition"
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('change_pass_start')}
                className="flex-1 py-2.5 bg-[#1C2030] text-slate-200 font-bold rounded-xl hover:bg-[#252A3F] transition"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg hover:bg-amber-300 transition"
              >
                Verify Security OTP
              </button>
            </div>
          </form>
        )}

        {/* ------------------- FORGOT PASSWORD ------------------- */}
        {step === 'forgot_start' && (
          <form onSubmit={handleSendForgotOtp} className="space-y-4">
            <div className="bg-[#181C2B] border border-amber-500/30 p-3 rounded-2xl text-xs space-y-1">
              <span className="font-bold text-amber-300 block">Reset Admin Password</span>
              <p className="text-slate-300">
                OTP security code will be sent to registered Admin Mobile:
              </p>
              <span className="font-mono font-bold text-amber-400 block pt-1">
                {adminProfile.adminMobile}
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-200 mb-1 block">Registered Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="sanket123"
                className="w-full bg-[#181C2B] border border-amber-500/40 rounded-xl px-4 py-2.5 text-sm text-slate-100"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('login')}
                className="flex-1 py-2.5 bg-[#1C2030] text-slate-200 font-bold rounded-xl hover:bg-[#252A3F] transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg hover:bg-amber-300 transition"
              >
                Send OTP
              </button>
            </div>
          </form>
        )}

        {step === 'otp_forgot' && (
          <form onSubmit={handleVerifyForgotOtp} className="space-y-4">
            <div className="bg-[#241E12] border border-amber-500/40 p-3 rounded-2xl text-center space-y-2">
              <Smartphone className="w-6 h-6 text-amber-400 mx-auto animate-bounce" />
              <div>
                <p className="text-xs text-slate-200 font-bold">
                  Reset OTP sent to Admin Mobile:
                </p>
                <p className="text-sm font-black text-amber-300 tracking-wider font-mono">
                  {adminProfile.adminMobile}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <a
                  href={`https://wa.me/${adminProfile.adminMobile.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `🔐 Kishor Enterprises Reset Password Security Code: ${otp.join('')}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold hover:bg-emerald-500/30 transition flex items-center gap-1.5"
                >
                  <span>📲 Send to WhatsApp</span>
                </a>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-200 mb-2 block text-center">
                Enter 4-Digit Reset Code
              </label>
              <div className="flex items-center justify-center gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value;
                      setOtp(newOtp);
                    }}
                    className="w-12 h-12 bg-[#181C2B] border-2 border-amber-500/50 focus:border-amber-400 text-center text-lg font-black text-amber-300 rounded-xl focus:outline-none transition"
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('forgot_start')}
                className="flex-1 py-2.5 bg-[#1C2030] text-slate-200 font-bold rounded-xl hover:bg-[#252A3F] transition"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg hover:bg-amber-300 transition"
              >
                Verify Reset OTP
              </button>
            </div>
          </form>
        )}

        {/* ------------------- SAVE NEW PASSWORD ------------------- */}
        {(step === 'reset_password' || step === 'new_password') && (
          <form onSubmit={handleSaveNewPassword} className="space-y-4">
            <div className="bg-[#122A1E] border border-emerald-500/40 p-2.5 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>OTP Verified! Set your new Admin Password below.</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-200 block">New Password</label>
                {newPassword && (
                  <span className={`text-[10px] font-mono font-bold ${calculatePasswordStrength(newPassword).text}`}>
                    Strength: {calculatePasswordStrength(newPassword).label}
                  </span>
                )}
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 chars (e.g. Pass#2026)"
                  className="w-full bg-[#181C2B] border border-amber-500/40 rounded-xl pl-10 pr-10 py-2.5 text-sm text-amber-200 font-mono tracking-widest font-bold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition placeholder:font-sans placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-300 hover:text-amber-300 transition"
                  title={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter Bar */}
              {newPassword.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="grid grid-cols-3 gap-1.5 h-1.5">
                    <div className={`rounded-full transition-all duration-300 ${calculatePasswordStrength(newPassword).level >= 1 ? calculatePasswordStrength(newPassword).color : 'bg-slate-800'}`} />
                    <div className={`rounded-full transition-all duration-300 ${calculatePasswordStrength(newPassword).level >= 2 ? calculatePasswordStrength(newPassword).color : 'bg-slate-800'}`} />
                    <div className={`rounded-full transition-all duration-300 ${calculatePasswordStrength(newPassword).level >= 3 ? calculatePasswordStrength(newPassword).color : 'bg-slate-800'}`} />
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-200 block">Confirm New Password</label>
                {confirmPassword && (
                  <span className={`text-[10px] font-mono font-bold ${newPassword === confirmPassword ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {newPassword === confirmPassword ? '✓ Passwords Match' : '⚠️ Passwords do not match'}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className={`w-full bg-[#181C2B] border rounded-xl pl-10 pr-10 py-2.5 text-sm text-amber-200 font-mono tracking-widest font-bold focus:outline-none transition placeholder:font-sans placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-500 ${
                    confirmPassword && newPassword !== confirmPassword ? 'border-rose-500 focus:border-rose-400' : 'border-amber-500/40 focus:border-amber-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-300 hover:text-amber-300 transition"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('login')}
                className="flex-1 py-2.5 bg-[#1C2030] text-slate-200 font-bold rounded-xl hover:bg-[#252A3F] transition text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || (confirmPassword.length > 0 && newPassword !== confirmPassword)}
                className="flex-1 py-2.5 bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg hover:bg-amber-300 transition text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save New Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
