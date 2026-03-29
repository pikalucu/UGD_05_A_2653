'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthFromWrapper from '@/components/AuthFormWrapper';
import SocialAuth from '@/components/SocialAuth';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface LoginFormData {
  email: string;
  password: string;
  captchaInput: string;
  remberMe?: boolean;
}

interface ErrorObject {
  email?: string;
  password?: string;
  captcha?: string;
}

const MAX_ATTEMPTS = 3;

const generateCaptcha = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    captchaInput: ''
  });
  const [errors, setErrors] = useState<ErrorObject>({});
  const [attempts, setAttempts] = useState(MAX_ATTEMPTS);
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (attempts <= 0) {
      toast.error('Kesempatan login habis!', { theme: 'dark', position: 'top-right' });
      return;
    }

    const newErrors: ErrorObject = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email tidak boleh kosong';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email harus sesuai dengan format npm kalian (cth. 1905@gmail.com)';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password tidak boleh kosong';
    } else if (!/^\d+$/.test(formData.password)) {
      newErrors.password = 'Password harus sesuai dengan format npm kalian (cth. 220711905)';
    }

    if (!formData.captchaInput.trim()) {
      newErrors.captcha = 'Captcha belum diisi';
    } else if (formData.captchaInput !== captcha) {
      newErrors.captcha = 'Captcha tidak valid';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const newAttempts = Math.max(attempts - 1, 0);
      setAttempts(newAttempts);
      if (newAttempts === 0) {
        toast.error('Kesempatan login habis!', { theme: 'dark', position: 'top-right' });
      } else {
        toast.error(`Login Gagal! Sisa kesempatan: ${newAttempts}`, { theme: 'dark', position: 'top-right' });
      }
      setCaptcha(generateCaptcha());
      return;
    }

    localStorage.setItem('isLoggedIn', 'true');
    toast.success('Login Berhasil!', { theme: 'dark', position: 'top-right' });
    router.push('/home');
  };

  const handleReset = () => {
    setAttempts(MAX_ATTEMPTS);
    setCaptcha(generateCaptcha());
    toast.success('Kesempatan login berhasil direset!', { theme: 'dark', position: 'top-right' });
  };

  const isDisabled = attempts <= 0;

  return (
    <AuthFromWrapper title="Login">
      <p className="text-center text-sm font-semibold text-gray-600 mb-4">
        Sisa Kesempatan: {attempts}
      </p>
      <form onSubmit={handleSubmit} className="space-y-5 w-full">

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukan email"
          />
          {errors.email && <p className="text-red-500 text-sm italic mt-1">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Masukan password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm italic mt-1">{errors.password}</p>}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              name="remberMe"
              checked={formData.remberMe || false}
              onChange={(e) => setFormData(prev => ({ ...prev, remberMe: e.target.checked }))}
              className="mr-2 h-4 w-4 rounded border-gray-300"
            />
            Ingat Saya
          </label>
          <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
            Forgot Password?
          </Link>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Captcha:</span>
            <span className="font-mono text-lg font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded">
              {captcha}
            </span>
            <button
              type="button"
              onClick={() => setCaptcha(generateCaptcha())}
              className="text-blue-500 hover:text-blue-700"
            >
              🔄
            </button>
          </div>
          <input
            type="text"
            name="captchaInput"
            value={formData.captchaInput}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.captcha ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukan captcha"
          />
          {errors.captcha && <p className="text-red-500 text-sm italic mt-1">{errors.captcha}</p>}
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className={`w-full font-semibold py-2.5 px-4 rounded-lg text-white transition-colors ${
            isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Sign In
        </button>

        <button
          type="button"
          onClick={handleReset}
          disabled={!isDisabled}
          className={`w-full font-semibold py-2.5 px-4 rounded-lg text-white transition-colors ${
            isDisabled ? 'bg-green-500 hover:bg-green-600 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Reset Kesempatan
        </button>

        <SocialAuth />

        <p className="mt-6 text-center text-sm text-gray-600">
          Tidak punya akun?{' '}
          <Link href="/auth/register" className="text-blue-600 hover:text-blue-800 font-semibold">
            Daftar
          </Link>
        </p>
      </form>
    </AuthFromWrapper>
  );
};

export default LoginPage;