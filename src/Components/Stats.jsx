import { useQuery } from '@tanstack/react-query';
import { supabase } from '../API/supabase';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
      <div className="relative bg-slate-50 p-8 rounded-[2.5rem] shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] border border-white/50">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-indigo-500 rounded-2xl shadow-[inset_0px_2px_4px_rgba(255,255,255,0.3)]">
            <Wallet className="text-white" size={24} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">Live Balance</span>
        </div>
        <p className="text-slate-500 font-medium text-sm">Available Capital</p>
        <h2 className="text-5xl font-black text-slate-800 tracking-tighter mt-1">
          <span className="text-indigo-600">$</span>{balance.toLocaleString()}
        </h2>
      </div>
      <div className="bg-slate-50 p-8 rounded-[2.5rem] shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] border border-white/50 group hover:scale-[1.02] transition-transform duration-300">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-emerald-100 rounded-2xl shadow-[4px_4px_8px_#d1d1d1,-4px_-4px_8px_#ffffff]">
            <TrendingUp className="text-emerald-600" size={24} />
          </div>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Total Earnings</p>
        </div>
        <h2 className="text-4xl font-black text-emerald-500 tracking-tight">
          +${income.toLocaleString()}
        </h2>
        <div className="mt-4 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '70%' }}></div>
        </div>
      </div>
      <div className="bg-slate-50 p-8 rounded-[2.5rem] shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] border border-white/50 group hover:scale-[1.02] transition-transform duration-300">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-rose-100 rounded-2xl shadow-[4px_4px_8px_#d1d1d1,-4px_-4px_8px_#ffffff]">
            <TrendingDown className="text-rose-600" size={24} />
          </div>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Total Spends</p>
        </div>
        <h2 className="text-4xl font-black text-rose-500 tracking-tight">
          -${expense.toLocaleString()}
        </h2>
        <div className="mt-4 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-rose-500 rounded-full" style={{ width: '45%' }}></div>
        </div>
      </div>

    </div>
  );
};

export default Stats;