import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../API/supabase';
import useAuth from '../hooks/useAuth';
import { Sparkles, AlertCircle, DollarSign, Tag, Check, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const TransactionForm = ({ editingData, setEditingData, onSuccess }) => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [type, setType] = useState('expense');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({ mode: 'onChange' });

  useEffect(() => {
    if (editingData) {
      setValue('name', editingData.name);
      setValue('amount', Math.abs(editingData.amount));
      setType(editingData.amount < 0 ? 'expense' : 'income');
    } else {
      reset({ name: '', amount: '' });
      setType('expense');
    }
  }, [editingData, setValue, reset]);

  const mutation = useMutation({
    mutationFn: async (newData) => {
      const payload = { 
        ...newData,
        amount: type === 'expense' ? -Math.abs(newData.amount) : Math.abs(newData.amount),
        user_id: session.user.id,
      };

      return editingData
        ? await supabase.from('transactions').update(payload).eq('id', editingData.id)
        : await supabase.from('transactions').insert([payload]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      reset();
      setEditingData(null);
      if (onSuccess) onSuccess();
      toast.success(editingData ? 'Updated' : 'Added');
    },
  });

  return (
    <div className="w-full max-w-sm mx-auto">
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="flex flex-col space-y-6"
      >
        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-bold transition-all duration-200
              ${type === 'income' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {type === 'income' && <Check size={12} />} INCOME
          </button>
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-bold transition-all duration-200
              ${type === 'expense' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {type === 'expense' && <Check size={12} />} EXPENSE
          </button>
        </div>
        <div className="space-y-1 text-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount</p>
          <div className="relative inline-block w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-medium text-slate-400">$</span>
            <input
              type="number"
              step="0.01"
              autoFocus
              {...register('amount', {
                required: 'Required',
                validate: v => v != 0 || 'Min 0.01',
              })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-10 text-3xl font-bold outline-none text-slate-800 focus:border-indigo-500 focus:bg-white transition-all text-center"
              placeholder="0.00"
            />
          </div>
          {errors.amount && (
            <p className="text-rose-600 text-[10px] font-bold mt-1 flex items-center justify-center gap-1">
              <AlertCircle size={10} /> {errors.amount.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Label</label>
          <div className={`flex items-center rounded-xl px-4 py-3 bg-slate-50 border transition-all
            ${errors.name ? 'border-rose-300 bg-rose-50' : 'border-slate-200 focus-within:border-indigo-500 focus-within:bg-white'}`}>
            <Tag size={16} className="text-slate-400 mr-3" />
            <input
              {...register('name', {
                required: 'Name required',
                minLength: { value: 3, message: 'Too short' },
              })}
              className="w-full bg-transparent text-sm font-bold outline-none text-slate-700 placeholder:text-slate-300"
              placeholder="e.g. Starbucks Coffee"
            />
          </div>
          {errors.name && (
            <p className="text-rose-600 text-[10px] font-bold ml-1 flex items-center gap-1">
              <AlertCircle size={10} /> {errors.name.message}
            </p>
          )}
        </div>
        <button
          disabled={mutation.isPending}
          className="group relative w-full h-12 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs transition-all active:scale-95 shadow-lg disabled:opacity-50"
        >
          <div className="flex items-center justify-center gap-2">
            {mutation.isPending ? 'Saving...' : (
              <>
                {editingData ? 'Update Record' : 'Save Transaction'}
                <ArrowRight size={14} />
              </>
            )}
          </div>
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;