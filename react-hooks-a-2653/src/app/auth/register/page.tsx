'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthFromWrapper from '@/components/AuthFormWrapper';
import SocialAuth from '@/components/SocialAuth';
import { toast } from 'react-toastify';

type RegisterFormData = {
  username: string;
  email: string;
  nomorTelp: string;
  password: string;
  confirmPassword: string;
  captcha: string;
};

const generateCaptcha = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const RegisterPage = () => {
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<RegisterFormData>();
  const [captchaInput, setCaptchaInput] = useState('');
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [strength, setStrength] = useState(0);

  const password = watch('password', '');

  useEffect(() => {
    const s = Math.min(
      (password.length > 7 ? 25 : 0) +
      (/[A-Z]/.test(password) ? 25 : 0) +
      (/[0-9]/.test(password) ? 25 : 0) +
      (/[^A-Za-z0-9]/.test(password) ? 25 : 0),
      100
    );
    setStrength(s);
  }, [password]);

  const getStrengthColor = () => {
    if (strength <= 25) return 'bg-red-500';
    if (strength <= 50) return 'bg-yellow-500';
    if (strength <= 75) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const onSubmit = (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Konfirmasi password tidak cocok', { theme: 'dark' });
      return;
    }
    if (captchaInput !== captcha) {
      toast.error('Captcha salah', { theme: 'dark' });
      return;
    }
    toast.success('Registrasi Berhasil!', { theme: 'dark', position: 'top-right' });
    router.push('/auth/login');
  };

  return (
    <AuthFromWrapper title="Register">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">

        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium text-gray-700">
            Username <span className="text-gray-500 text-xs">(min 3, max 8 karakter)</span>
          </label>
          <input
            id="username"
            {...register('username', {
              required: 'Username wajib diisi',
              minLength: { value: 3, message: 'Minimal 3 karakter' },
              maxLength: { value: 8, message: 'Maksimal 8 karakter' }
            })}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukkan username"
          />
          {errors.username && <p className="text-red-600 text-sm italic mt-1">{errors.username.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'Email wajib diisi',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Format email tidak valid' }
            })}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukkan email"
          />
          {errors.email && <p className="text-red-600 text-sm italic mt-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="nomorTelp" className="text-sm font-medium text-gray-700">Nomor Telepon</label>
          <input
            id="nomorTelp"
            type="tel"
            {...register('nomorTelp', {
              required: 'Nomor telepon wajib diisi',
              minLength: { value: 10, message: 'Minimal 10 karakter' },
              pattern: { value: /^[0-9]+$/, message: 'Hanya boleh angka' }
            })}
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
            }}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.nomorTelp ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukkan nomor telepon"
          />
          {errors.nomorTelp && <p className="text-red-600 text-sm italic mt-1">{errors.nomorTelp.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Password wajib diisi',
                minLength: { value: 8, message: 'Minimal 8 karakter' }
              })}
              className={`w-full px-4 py-2.5 rounded-lg border pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Masukkan password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div className={`h-2 rounded-full transition-all ${getStrengthColor()}`} style={{ width: `${strength}%` }} />
          </div>
          <p className="text-xs text-gray-500">Strength: {strength}%</p>
          {errors.password && <p className="text-red-600 text-sm italic mt-1">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Konfirmasi Password</label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              {...register('confirmPassword', { required: 'Konfirmasi password wajib diisi' })}
              className={`w-full px-4 py-2.5 rounded-lg border pr-10 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Masukkan ulang password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirm ? '🙈' : '👁️'}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-600 text-sm italic mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Captcha:</span>
            <span className="font-mono text-lg font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded">{captcha}</span>
            <button type="button" onClick={() => setCaptcha(generateCaptcha())} className="text-blue-500 hover:text-blue-700 text-lg">
              🔄
            </button>
          </div>
          <input
            type="text"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
            placeholder="Masukkan captcha"
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg">
          Register
        </button>

        <SocialAuth />
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Sudah punya akun?{' '}
        <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-semibold">Login</Link>
      </p>
    </AuthFromWrapper>
  );
};

export default RegisterPage;