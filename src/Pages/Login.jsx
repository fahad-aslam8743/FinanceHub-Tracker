import React, { useState, useEffect } from 'react';
import { supabase } from '../API/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Command, Loader2, Mail, Lock, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onBlur" });

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const onSubmit = async (formData) => {
    const { email, password } = formData;
    toast.dismiss(); 
    const toastId = toast.loading('Authenticating...');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message, { id: toastId });
      } else {
        toast.success('Welcome Back', { id: toastId });
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
    } catch (err) {
      toast.error('Connection failed', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 md:p-6 selection:bg-indigo-100">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50/50 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50/50 blur-[120px] rounded-full" />
      </div>
      <div className="relative w-full max-w-[420px] z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-white shadow-xl shadow-slate-200/50 border border-slate-100 rounded-[1.5rem] flex items-center justify-center mb-6">
            <Command size={28} className="text-slate-900" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter">FinanceHub</h2>
          <div className="flex items-center gap-1.5 mt-2 opacity-40">
            <ShieldCheck size={12} className="text-indigo-600" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Secure Protocol</p>
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]">
          <div className="mb-8 text-center md:text-left">
            <h3 className="text-xl font-bold text-slate-900">Identity Verification</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">Please enter your authorized credentials.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Work Email</label>
              <div className={`flex items-center bg-slate-50 border transition-all duration-300 rounded-2xl px-4 py-3.5
                ${errors.email ? 'border-rose-200 bg-rose-50/30' : 'border-slate-100 focus-within:border-indigo-200 focus-within:bg-white focus-within:shadow-sm'}`}>
                <Mail size={18} className="text-slate-300 mr-3" />
                <input
                  type="email"
                  placeholder="name@finance.com"
                  className="w-full bg-transparent text-sm font-semibold outline-none text-slate-700 placeholder:text-slate-300"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid format" }
                  })}/>
              </div>
              {errors.email && (
                <p className="text-rose-500 text-[10px] font-bold ml-1 flex items-center gap-1">
                  <AlertCircle size={10}/> {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Access Key</label>
              <div className={`flex items-center bg-slate-50 border transition-all duration-300 rounded-2xl px-4 py-3.5
                ${errors.password ? 'border-rose-200 bg-rose-50/30' : 'border-slate-100 focus-within:border-indigo-200 focus-within:bg-white focus-within:shadow-sm'}`}>
                <Lock size={18} className="text-slate-300 mr-3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm font-semibold outline-none text-slate-700 placeholder:text-slate-300"
                  {...register("password", { required: "Key is required" })}/>
              </div>
              {errors.password && (
                <p className="text-rose-500 text-[10px] font-bold ml-1 flex items-center gap-1">
                  <AlertCircle size={10}/> {errors.password.message}
                </p>
              )}
            </div>
            <button
              disabled={loading}
              type="submit"
              className="group w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 transition-all duration-300 active:scale-95 disabled:opacity-50 mt-4 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={18}/> : (
                <>
                  Verify Account
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs font-medium text-slate-400">
              New associate? 
              <Link to="/signup" className="ml-2 text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
                Apply for Access
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">
          Terminal v2.0.4 — © 2026
        </p>
      </div>
    </div>
  );
}

export default Login;