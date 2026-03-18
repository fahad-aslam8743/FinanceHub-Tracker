import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../API/supabase';
import useAuth from '../hooks/useAuth';
import { Sparkles, ArrowRight, AlertCircle, DollarSign, PenTool } from 'lucide-react';
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
      setType('expense');
      if (onSuccess) onSuccess();
      toast.success('Saved');
    },
  });

  return (
    <div className="w-full flex justify-center items-start sm:items-center px-4 sm:px-0">
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="relative w-full sm:w-[480px] bg-white/10 dark:bg-white/5 border border-white/20 rounded-3xl p-4 sm:p-6 shadow-xl sm:shadow-2xl backdrop-blur-xl"
      >
        {/* Glow (desktop only) */}
        <div className="hidden sm:block absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500 blur-[100px] rounded-full" />
          <div className="absolute bottom-[-20px] right-[-20px] w-40 h-40 bg-violet-500 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 flex flex-col space-y-5">

          {/* Type Toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition
                ${type === 'income' ? 'bg-green-500 text-white' : 'bg-white/20 text-white/60'}`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition
                ${type === 'expense' ? 'bg-rose-500 text-white' : 'bg-white/20 text-white/60'}`}
            >
              Expense
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-1">
            <label className="text-[10px] text-white/50 uppercase tracking-widest ml-1">
              Amount
            </label>
            <div className={`flex items-center rounded-xl px-3 py-3 bg-white/10 border transition
              ${errors.amount ? 'border-rose-400/50' : 'border-white/20 focus-within:border-indigo-400/60'}`}>
              <DollarSign size={16} className="text-white/50 mr-2" />
              <input
                type="number"
                step="0.01"
                {...register('amount', {
                  required: 'Amount required',
                  validate: v => v != 0 || 'Cannot be zero',
                })}
                className="w-full bg-transparent text-lg font-semibold outline-none text-white placeholder:text-white/30"
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p className="text-rose-400 text-[10px] ml-1 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.amount.message}
              </p>
            )}
          </div>

          {/* Name */}
          <div className="space-y-1">
            <label className="text-[10px] text-white/50 uppercase tracking-widest ml-1">
              Category
            </label>
            <div className={`flex items-center rounded-xl px-3 py-3 bg-white/10 border transition
              ${errors.name ? 'border-rose-400/50' : 'border-white/20 focus-within:border-indigo-400/60'}`}>
              <PenTool size={16} className="text-white/50 mr-2" />
              <input
                {...register('name', {
                  required: 'Name required',
                  minLength: { value: 3, message: 'Too short' },
                })}
                className="w-full bg-transparent text-sm outline-none text-white placeholder:text-white/30"
                placeholder="Food, Netflix..."
              />
            </div>
            {errors.name && (
              <p className="text-rose-400 text-[10px] ml-1 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.name.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            disabled={mutation.isPending}
            className={`w-full h-12 rounded-xl text-sm font-semibold text-white transition active:scale-95
              ${type === 'income' ? 'bg-green-500 hover:brightness-110' : 'bg-rose-500 hover:brightness-110'}`}
          >
            {mutation.isPending ? 'Processing...' : editingData ? 'Update' : 'Add Transaction'}
          </button>

        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-center">
          <div className="px-3 py-1 rounded-full bg-white/10 border border-white/20 flex items-center gap-1.5">
            <Sparkles size={10} className="text-yellow-400" />
            <span className="text-[9px] text-white/50">Smart Finance</span>
          </div>
        </div>

      </form>
    </div>
  );
};

export default TransactionForm;