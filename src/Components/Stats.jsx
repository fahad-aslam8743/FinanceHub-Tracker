import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../API/supabase';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

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
    <div className="w-full mb-10 space-y-4">

      {/* MAIN BALANCE CARD */}
      <div className="backdrop-blur-xl bg-white/[0.06] border border-white/10 rounded-3xl p-6">

        <p className="text-xs text-white/40 mb-2">Total Balance</p>

        <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">
          ${balance.toLocaleString()}
        </h1>

      </div>

      {/* INCOME / EXPENSE */}
      <div className="grid grid-cols-2 gap-3">

        {/* Income */}
        <div className="backdrop-blur-xl bg-white/[0.06] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <ArrowUpRight size={16} className="text-green-400" />
            <p className="text-[10px] text-white/40 uppercase">Income</p>
          </div>
          <p className="text-lg font-semibold text-green-400">
            +${income.toLocaleString()}
          </p>
        </div>

        {/* Expense */}
        <div className="backdrop-blur-xl bg-white/[0.06] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <ArrowDownLeft size={16} className="text-rose-400" />
            <p className="text-[10px] text-white/40 uppercase">Expense</p>
          </div>
          <p className="text-lg font-semibold text-rose-400">
            -${expense.toLocaleString()}
          </p>
        </div>

      </div>

    </div>
  );
};

export default Stats;