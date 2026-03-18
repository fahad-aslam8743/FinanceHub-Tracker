import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../API/supabase';
import { Trash2, Edit3, Loader2, ArrowUpRight, ArrowDownLeft, Inbox, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const TransactionList = ({ onEdit }) => {
  const queryClient = useQueryClient();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await supabase.from('transactions').delete().eq('id', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      toast.success('Removed');
    },
  });

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
    </div>
  );

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 px-4 md:px-6 py-4 border-b border-slate-50">
         <Clock size={14} className="text-slate-300" />
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {transactions?.length || 0} Records
         </p>
      </div>
      <div className="divide-y divide-slate-50">
        {transactions?.map((t) => {
          const isIncome = t.amount > 0;
          return (
            <div 
              key={t.id}
              className="group flex flex-col sm:flex-row sm:items-center justify-between bg-white px-4 md:px-8 py-4 transition-all hover:bg-slate-50/50">
              <div className="flex items-center gap-4 mb-3 sm:mb-0">
                <div className={`w-10 h-10 flex items-center justify-center rounded-2xl shrink-0
                  ${isIncome ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                  {isIncome ? <ArrowUpRight size={18} strokeWidth={2.5} /> : <ArrowDownLeft size={18} strokeWidth={2.5} />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate capitalize leading-tight">
                    {t.name}
                  </p>
                  <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                    {new Date(t.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-8 border-t sm:border-0 pt-3 sm:pt-0">
                <p className={`text-base md:text-lg font-black tracking-tight ${isIncome ? 'text-emerald-500' : 'text-slate-900'}`}>
                  {isIncome ? '+' : '-'}${Math.abs(t.amount).toLocaleString()}
                </p>
                <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300">
                  <button 
                    onClick={() => onEdit(t)}
                    className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 active:bg-indigo-50 transition-colors">
                    <Edit3 size={14} />
                  </button>
                  <button 
                    onClick={() => deleteMutation.mutate(t.id)}
                    className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-600 active:bg-rose-50 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {transactions?.length === 0 && (
        <div className="text-center py-20">
          <Inbox className="mx-auto text-slate-100 mb-2" size={40} />
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Activity</p>
        </div>
      )}
    </div>
  );
};

export default TransactionList;