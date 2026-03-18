import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../API/supabase';
import { ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';

const Stats = () => {
  const { data: transactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data } = await supabase.from('transactions').select('*');
      return data || [];
    },
  });

  const income = transactions?.filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0) || 0;

  const expense = transactions?.filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + Math.abs(t.amount), 0) || 0;

  const balance = income - expense;

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 bg-white/80 backdrop-blur-xl border border-slate-100 p-4 md:p-6 rounded-[2rem] shadow-sm">
      <div className="flex items-center gap-4 w-full md:w-auto px-2">
        <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-lg">
          <Wallet size={18} />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Vault</p>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter leading-none">
            ${balance.toLocaleString()}
          </h1>
        </div>
      </div>
      <div className="hidden md:block w-[1px] h-10 bg-slate-100" />
      <div className="flex items-center justify-between md:justify-end gap-6 md:gap-12 w-full md:flex-1 px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
            <ArrowUpRight size={16} strokeWidth={3} />
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Inflow</p>
            <p className="text-sm md:text-lg font-black text-emerald-600 leading-none mt-0.5">
              +${income.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-right">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Outflow</p>
            <p className="text-sm md:text-lg font-black text-rose-600 leading-none mt-0.5">
              -${expense.toLocaleString()}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
            <ArrowDownLeft size={16} strokeWidth={3} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;