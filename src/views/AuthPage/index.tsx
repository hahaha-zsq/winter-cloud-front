import React, { useState, useEffect, type FormEvent } from 'react';
import dayjs from 'dayjs';
// 1. 更改引入：使用 react-icons 的 Feather (fi) 和 BoxIcons (bi) 系列
import {
    FiMail,
    FiLock,
    FiKey,
    FiEye,
    FiEyeOff,
    FiGlobe,
    FiShield,
    FiCheckCircle,
    FiAlertCircle,
    FiArrowLeft,
    FiUnlock // 用来替代 LockKeyhole
} from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi'; // 这是一个非常好看的 Spinner

import styles from './index.module.less';
import { i18n, type LangKey } from './locales';
import {loginApi} from "@/api";
import {useNavigate} from "react-router-dom";
import storage from "@/utils/storage.ts";
import {StorageEnum} from "@/types/enum.ts";
import {useStore} from "@/store";

const bgImage = "src/assets/authPage.png";

// --- Types ---
type ViewState = 'login' | 'forgot';
type ToastState = { show: boolean; msg: string; type: 'success' | 'error' };

const AuthPageFC: React.FC = () => {
    // 1. Global State
    const [lang, setLang] = useState<LangKey>('zh');
    const [view, setView] = useState<ViewState>('login');
    const t = i18n[lang];
    const navigate = useNavigate()

    // 2. Form State
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        resetEmail: '',
        code: '',
        newPassword: '',
        confirmPassword: ''
    });

    // 3. UI/Validation State
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
    const [toast, setToast] = useState<ToastState>({ show: false, msg: '', type: 'success' });
    const [countdown, setCountdown] = useState(0);
    const {actions} = useStore()

    // --- Helpers ---
    const togglePass = (field: string) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrs = { ...prev };
                delete newErrs[name];
                return newErrs;
            });
        }
    };

    // --- Validation Logic ---
    const validateField = (name: string, value: string): string | null => {
        // 1. 定义你提供的正则表达式
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        // 密码正则：8-15位，包含大小写字母、数字、特殊字符
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,15}$/;
        switch (name) {
            case 'email':
            case 'resetEmail':
                if (!value) return t.err_email_empty;
                // 使用新的邮箱正则
                if (!emailRegex.test(value)) return t.err_email_invalid;
                break;
            case 'password':
                if (!value) return t.err_password_empty;
                if (!passwordRegex.test(value)) return t.err_password;
                break;
            case 'newPassword':
                if (!value) return t.err_new_password_empty;
                // 使用新的密码正则
                if (!passwordRegex.test(value)) return t.err_password;
                break;
            case 'code':
                if (!/^\d{6}$/.test(value)) return t.err_code_length;
                break;
            case 'confirmPassword':
                if (!value) return t.err_confirm_password_empty;
                if (value !== formData.newPassword) return t.err_confirm_mismatch;
                break;
        }
        return null;
    };

    // --- Actions ---
    const handleSendCode = () => {
        const err = validateField('resetEmail', formData.resetEmail);
        if (err) {
            setErrors(prev => ({ ...prev, resetEmail: err }));
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            showToast(t.msg_code_sent, 'success');
            setCountdown(60);
        }, 1000);
    };

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        const emailErr = validateField('email', formData.email);
        if (emailErr) newErrors.email = emailErr;

        const passErr = validateField('password', formData.password);
        if (passErr) newErrors.password = passErr;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        // 方法 A: 直接解构获取
        const {email, password} = formData;

        // 打印查看
        console.log('准备提交的登录数据:', {email, password});


        try {
            const data = await loginApi({ email, password });
            setIsLoading(false);
            storage.set(StorageEnum.UserInfo, data)
            // actions.setUserInfo(data)
            showToast(t.msg_login_success, 'success');
            setTimeout(() => {
                navigate("/layout")
            }, 1000)
        } catch (error) {
            setIsLoading(false);
        }
    };

    const handleReset = (e: FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        const fields = ['resetEmail', 'code', 'newPassword', 'confirmPassword'];
        fields.forEach(field => {
            // @ts-ignore
            const err = validateField(field, formData[field]);
            if (err) newErrors[field] = err;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            showToast(t.msg_reset_success, 'success');
            setTimeout(() => {
                setView('login');
                setFormData(prev => ({ ...prev, code: '', newPassword: '', confirmPassword: '' }));
            }, 1500);
        }, 1500);
    };

    // --- Sub-Components (Input Renderer) ---
    const renderInput = (
        name: keyof typeof formData,
        label: string,
        IconComponent: React.ElementType,
        type: string = 'text',
        placeholder: string
    ) => {
        const isPassword = type === 'password';
        const isVisible = showPassword[name];
        const currentType = isPassword ? (isVisible ? 'text' : 'password') : type;
        const hasError = !!errors[name];

        const focusClasses = "focus:border-[#1f4cb8] focus:ring-[#1f4cb8]";

        return (
            <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {/* 图标渲染逻辑不变，react-icons 完全兼容 */}
                        <IconComponent className="h-5 w-5 text-gray-400" />
                    </div>

                    <input
                        name={name}
                        type={currentType}
                        value={formData[name as keyof typeof formData]}
                        onChange={handleInputChange}
                        onBlur={(e) => {
                            const err = validateField(name, e.target.value);
                            if (err) setErrors(prev => ({ ...prev, [name]: err }));
                        }}
                        placeholder={placeholder}
                        className={`
              block w-full pl-10 sm:text-sm rounded-lg py-3 transition-colors outline-none border 
              ${hasError
                            ? `border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50 ${styles.shake}`
                            : `border-gray-300 ${focusClasses}`
                        }
              ${isPassword ? 'pr-10' : ''}
            `}
                    />

                    {isPassword && (
                        <div
                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                            onClick={() => togglePass(name)}
                        >
                            {isVisible ? (
                                <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                        </div>
                    )}
                </div>
                {hasError && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
            </div>
        );
    };

    const primaryButtonClass = `
    w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm 
    text-sm font-medium text-white 
    bg-[#1f4cb8] hover:bg-[#17388a] 
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1f4cb8] 
    transition-all transform hover:scale-[1.01] active:scale-[0.99] 
    disabled:opacity-70 disabled:cursor-not-allowed
  `;

    return (
        <div className="bg-gray-50 h-screen w-full overflow-hidden flex flex-col md:flex-row font-sans">

            {/* Language Switcher */}
            <div className="absolute top-4 right-4 z-20">
                <button
                    onClick={() => setLang(l => l === 'en' ? 'zh' : 'en')}
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1f4cb8] transition-colors items-center"
                >
                    {/* 使用 FiGlobe */}
                    <FiGlobe className="mr-2 h-4 w-4" />
                    {lang === 'en' ? 'English' : '中文'}
                </button>
            </div>

            {/* Left Side */}
            <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-slate-900 h-full relative overflow-hidden items-center justify-center">
                <img
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover"
                    src={bgImage}
                />
                <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply pointer-events-none"></div>

                <div className="relative z-10 p-12 text-white max-w-lg">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight drop-shadow-md">{t.hero_title}</h1>
                    <p className="text-lg text-white/90 leading-relaxed drop-shadow-sm">{t.hero_desc}</p>
                </div>
            </div>

            {/* Right Side */}
            <div className="w-full md:w-1/2 lg:w-2/5 h-full flex items-center justify-center bg-white p-6 md:p-12 overflow-y-auto">
                <div className="w-full max-w-md space-y-8">

                    {/* Mobile Logo */}
                    <div className="md:hidden flex justify-center mb-6">
                        <div className="h-12 w-12 bg-[#1f4cb8] rounded-xl flex items-center justify-center shadow-lg">
                            {/* 使用 FiShield */}
                            <FiShield className="text-white h-8 w-8" />
                        </div>
                    </div>

                    {/* LOGIN VIEW */}
                    {view === 'login' && (
                        <div className={styles.formEnter}>
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold text-gray-900">{t.login_title}</h2>
                                <p className="mt-2 text-sm text-gray-600">{t.login_subtitle}</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-6">
                                {/* 2. 使用新引入的图标组件 */}
                                {renderInput('email', t.label_email, FiMail, 'email', 'admin@system.com')}
                                {renderInput('password', t.label_password, FiLock, 'password', '••••••••')}

                                <div className="flex items-center justify-end">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setView('forgot');
                                            setErrors({});
                                        }}
                                        className="text-sm font-medium text-slate-600 hover:text-[#1f4cb8] transition-colors focus:outline-none"
                                    >
                                        {t.link_forgot_password}
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={primaryButtonClass}
                                >
                                    {isLoading ? (
                                        // 使用 BiLoaderAlt
                                        <BiLoaderAlt className="animate-spin h-5 w-5" />
                                    ) : t.btn_sign_in}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* FORGOT PASSWORD VIEW */}
                    {view === 'forgot' && (
                        <div className={styles.formEnter}>
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">{t.reset_title}</h2>
                                <p className="mt-2 text-sm text-gray-600">{t.reset_subtitle}</p>
                            </div>

                            <form onSubmit={handleReset} className="space-y-5">
                                {renderInput('resetEmail', t.label_email, FiMail, 'email', 'admin@system.com')}

                                <div className="form-group">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.label_verification_code}</label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-grow">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                {/* 使用 FiKey */}
                                                <FiKey className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                name="code"
                                                maxLength={6}
                                                value={formData.code}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                                    setFormData(prev => ({ ...prev, code: val }));
                                                    if (errors.code) setErrors(prev => { const n = { ...prev }; delete n.code; return n; });
                                                }}
                                                className={`block w-full pl-10 sm:text-sm rounded-lg py-3 tracking-widest outline-none border ${errors.code ? `border-red-500 bg-red-50 ${styles.shake}` : 'border-gray-300 focus:border-[#1f4cb8] focus:ring-[#1f4cb8]'}`}
                                                placeholder="123456"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleSendCode}
                                            disabled={countdown > 0 || isLoading}
                                            className="flex-shrink-0 bg-[#eff6ff] text-[#1f4cb8]  border border-[#bfdbfe] font-medium py-2 px-4 rounded-lg text-sm transition-colors whitespace-nowrap min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {countdown > 0 ? `${countdown}s` : (isLoading && countdown === 0 ? t.btn_sending : t.btn_send_code)}
                                        </button>
                                    </div>
                                    {errors.code && <p className="mt-1 text-xs text-red-500">{errors.code}</p>}
                                </div>

                                {/* 使用 FiUnlock 和 FiLock */}
                                {renderInput('newPassword', t.label_new_password, FiUnlock, 'password', '••••••••')}
                                {renderInput('confirmPassword', t.label_confirm_password, FiLock, 'password', '••••••••')}

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={primaryButtonClass}
                                    >
                                        {isLoading ? <BiLoaderAlt className="animate-spin h-5 w-5" /> : t.btn_reset_password}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => {
                                        setView('login');
                                        setErrors({});
                                    }}
                                    className="flex items-center justify-center w-full text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors gap-2"
                                >
                                    {/* 使用 FiArrowLeft */}
                                    <FiArrowLeft className="h-5 w-5" />
                                    <span>{t.link_back_to_login}</span>
                                </button>
                            </div>
                        </div>
                    )}

                    <p className="mt-8 text-center text-xs text-gray-400">
                        © {dayjs().year()} Winter Cloud {t.footer_rights}
                    </p>
                </div>
            </div>

            {/* Toast Notification */}
            <div
                className={`fixed top-5 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 pointer-events-none z-50 flex items-center gap-2 ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
                {toast.type === 'success' ? (
                    // 使用 FiCheckCircle
                    <FiCheckCircle className="text-green-400 h-6 w-6" />
                ) : (
                    // 使用 FiAlertCircle
                    <FiAlertCircle className="text-red-400 h-6 w-6" />
                )}
                <span>{toast.msg}</span>
            </div>

        </div>
    );
};

export default AuthPageFC;