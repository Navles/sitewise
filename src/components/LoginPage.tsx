import React, { useState } from 'react';
import { Eye, EyeOff, Shield, User, Lock, Smartphone, Phone, ArrowRight } from 'lucide-react';
import { motion } from "framer-motion";


interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [loginMethod, setLoginMethod] = useState<'credentials' | 'mobile'>('credentials');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    mobile: '',
    otp: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateCredentialsForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateMobileForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\+?[\d\s-()]{10,15}$/.test(formData.mobile.trim())) {
      newErrors.mobile = 'Please enter a valid mobile number';
    }

    if (otpSent && !formData.otp) {
      newErrors.otp = 'OTP is required';
    } else if (otpSent && !/^\d{6}$/.test(formData.otp)) {
      newErrors.otp = 'OTP must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async () => {
    if (!validateMobileForm()) return;

    setIsLoading(true);
    
    // Simulate OTP sending delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setOtpSent(true);
    setIsLoading(false);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let isValid = false;
    
    if (loginMethod === 'credentials') {
      isValid = validateCredentialsForm();
    } else {
      isValid = validateMobileForm();
      if (!otpSent) {
        await handleSendOTP();
        return;
      }
    }

    if (!isValid) return;

    setIsLoading(true);

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simple validation for demo purposes
    if (loginMethod === 'credentials') {
      if (formData.username === 'admin' && formData.password === 'password') {
        onLogin();
      } else {
        setErrors({
          general: 'Invalid credentials. Try: admin / password'
        });
      }
    } else {
      if (formData.otp === '123456') {
        onLogin();
      } else {
        setErrors({
          general: 'Invalid OTP. Try: 123456'
        });
      }
    }

    setIsLoading(false);
  };

  const switchLoginMethod = (method: 'credentials' | 'mobile') => {
    setLoginMethod(method);
    setFormData({ username: '', password: '', mobile: '', otp: '' });
    setErrors({});
    setOtpSent(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left Side - Logo Section */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-900 to-slate-900">
        <div className="text-center px-4 py-8">
          <div className="mb-8 mt-8">
            <div className="relative flex justify-center items-center mb-16">
      {/* Gradient border glow */}
    <motion.div
  className="relative rounded-2xl overflow-hidden shadow-lg"
  style={{
    width: 180,
    height: 180,
    background:
      "linear-gradient(145deg, #0f172a 0%, #1e3a8a 50%, #3b82f6 100%)",
  }}
  animate={{
    boxShadow: [
      "0 0 30px #3b82f6",
      "0 0 50px #1e3a8a",
      "0 0 30px #3b82f6",
    ],
  }}
  transition={{
    duration: 3,
    repeat: Infinity,
    repeatType: "mirror",
  }}
>
  {/* Shine sweep (behind image) */}
  <motion.div
    className="absolute top-[-50%] left-[-50%] w-[60px] h-[200%] bg-white/30 rotate-[25deg] z-0"
    animate={{
      left: ["-60%", "130%"],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      repeatDelay: 3,
    }}
  />

  {/* Logo Image */}
  <img
    src="/logo2.png"
    alt="Site Wise Logo"
    className="w-[90%] h-[90%] object-contain rounded-2xl mx-auto mt-[5%] relative z-10"
  />
</motion.div>
    </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 animate-fade-in-up">Site Wise</h1>
          <p className="text-lg sm:text-xl md:text-xl lg:text-2xl text-blue-200 mb-2 animate-fade-in-up animation-delay-200">Dynamic Site Manager</p>
          <p className="text-sm sm:text-base md:text-lg text-blue-300 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-4 animate-fade-in-up animation-delay-400">
            Intelligent site configuration and management system with AI-powered assistance
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-sm sm:max-w-md">
          <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-800">
            {/* Form Header */}
            <div className="text-center mb-8">
              <div className="bg-blue-600 p-3 rounded-lg inline-block mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-slate-400">Choose your preferred login method</p>
            </div>

            {/* Login Method Toggle */}
            <div className="flex bg-slate-800 rounded-lg p-1 mb-6">
              <button
                type="button"
                onClick={() => switchLoginMethod('credentials')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginMethod === 'credentials'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="h-4 w-4 inline mr-2" />
                Credentials
              </button>
              <button
                type="button"
                onClick={() => switchLoginMethod('mobile')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginMethod === 'mobile'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Phone className="h-4 w-4 inline mr-2" />
                Mobile OTP
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
                  {errors.general}
                </div>
              )}

              {loginMethod === 'credentials' ? (
                <>
                  {/* Username Field */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.username ? 'border-red-500' : 'border-slate-600'
                        }`}
                        placeholder="Enter your username"
                      />
                    </div>
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-400">{errors.username}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-12 py-3 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.password ? 'border-red-500' : 'border-slate-600'
                        }`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Mobile Number Field */}
                  <div>
                    <label htmlFor="mobile" className="block text-sm font-medium text-slate-300 mb-2">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="tel"
                        id="mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        disabled={otpSent}
                        className={`w-full pl-10 pr-4 py-3 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          errors.mobile ? 'border-red-500' : 'border-slate-600'
                        }`}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    {errors.mobile && (
                      <p className="mt-1 text-sm text-red-400">{errors.mobile}</p>
                    )}
                  </div>

                  {/* OTP Field - Only show after OTP is sent */}
                  {otpSent && (
                    <div>
                      <label htmlFor="otp" className="block text-sm font-medium text-slate-300 mb-2">
                        Verification Code
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Smartphone className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          type="text"
                          id="otp"
                          name="otp"
                          value={formData.otp}
                          onChange={handleInputChange}
                          maxLength={6}
                          className={`w-full pl-10 pr-4 py-3 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors tracking-widest text-center ${
                            errors.otp ? 'border-red-500' : 'border-slate-600'
                          }`}
                          placeholder="000000"
                        />
                      </div>
                      {errors.otp && (
                        <p className="mt-1 text-sm text-red-400">{errors.otp}</p>
                      )}
                      <p className="mt-1 text-xs text-slate-500">
                        Enter the 6-digit code sent to your mobile
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>
                      {loginMethod === 'mobile' && !otpSent ? 'Sending OTP...' : 'Signing In...'}
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      {loginMethod === 'mobile' && !otpSent ? 'Send OTP' : 'Sign In'}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* Resend OTP Button */}
              {loginMethod === 'mobile' && otpSent && (
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setFormData(prev => ({ ...prev, otp: '' }));
                  }}
                  className="w-full text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  Resend OTP
                </button>
              )}
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400 mb-2">Demo Credentials:</p>
              <div className="text-xs text-slate-300 space-y-1">
                {loginMethod === 'credentials' ? (
                  <>
                    <p>Username: <span className="font-mono text-blue-300">admin</span></p>
                    <p>Password: <span className="font-mono text-blue-300">password</span></p>
                  </>
                ) : (
                  <>
                    <p>Mobile: <span className="font-mono text-blue-300">Any valid number</span></p>
                    <p>OTP: <span className="font-mono text-blue-300">123456</span></p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};