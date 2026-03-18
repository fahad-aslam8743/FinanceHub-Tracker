import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { TrendingUp, Loader2, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';
import { supabase } from '../API/supabase';
import toast from 'react-hot-toast';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  const onSubmit = async (formData) => {
    setLoading(true);
    const { email,password } = formData
    const {error} =await supabase.auth.signUp({email,password})
    if(error){
      toast.error(error.message,{
        duration : 3000,
        style:{background : '#fff', color:'#000000', borderRadius:'15px'}
      })
    }else{
      toast.success('Welcome! Account Created',{
        duration : 3000,
        style : {background : '#fff', color:'#000000',borderRadius:'15px'}
      })
      navigate('/dashboard')
    }
    setLoading(false)
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] p-6 selection:bg-indigo-100 font-sans">
      <div className="max-w-md w-full bg-slate-50 p-10 rounded-[3.5rem] shadow-[30px_30px_60px_#bebebe,-30px_-30px_60px_#ffffff] border border-white/60">
        <div className="flex flex-col items-center mb-10">
          <div className="p-5 bg-white rounded-\[1\.5rem] shadow-[8px_8px_16px_#d1d1d1,-8px_-8px_16px_#ffffff] mb-4 text-indigo-600">
            <UserPlus size={36} strokeWidth={2.5}/>
          </div>
          <h2 className="text-3xl font-[1000] text-slate-800 tracking-tighter text-center uppercase">
            Create <span className="text-indigo-600">Hub</span>
          </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 block italic">Official Email</label>
            <div className="relative group">
              <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-400' : 'text-slate-400 group-focus-within:text-indigo-500'}`} size={18} />
              <input 
                type="email" 
                placeholder="you@example.com" 
                className={`w-full pl-14 pr-6 py-4 bg-slate-100 rounded-2xl text-slate-700 outline-none shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff] focus:ring-4 transition-all placeholder:text-slate-300 font-medium ${errors.email ? 'ring-red-500/20 border-red-100' : 'ring-indigo-500/10'}`}
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })} 
              />
            </div>
            {errors.email && <p className="text-red-500 text-[10px] ml-4 font-bold uppercase flex items-center gap-1 mt-1"><AlertCircle size={10}/> {errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 block italic">Access Key</label>
            <div className="relative group">
              <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-400' : 'text-slate-400 group-focus-within:text-indigo-500'}`} size={18} />
              <input 
                type="password" 
                placeholder="••••••••" 
                className={`w-full pl-14 pr-6 py-4 bg-slate-100 rounded-2xl text-slate-700 outline-none shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff] focus:ring-4 transition-all placeholder:text-slate-300 font-medium ${errors.password ? 'ring-red-500/20 border-red-100' : 'ring-indigo-500/10'}`}
                {...register("password", { 
                  required: "Password is required",
                  minLength: { value: 8, message: "Minimum 8 characters required!" }
                })} 
              />
            </div>
            {errors.password && <p className="text-red-500 text-[10px] ml-4 font-bold uppercase flex items-center gap-1 mt-1"><AlertCircle size={10}/> {errors.password.message}</p>}
          </div>

          <button 
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-[6px_6px_12px_#c2c2c2,-6px_-6px_12px_#ffffff] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 group"
          >
            {loading ? <Loader2 className="animate-spin" size={20}/> : (
              <>Sign Up Now <TrendingUp size={16} className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm font-medium">
          Already a member? 
          <Link to="/login" className="ml-2 text-indigo-600 font-black hover:text-indigo-800 transition-colors underline-offset-4 decoration-2">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;