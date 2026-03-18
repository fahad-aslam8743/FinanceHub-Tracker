import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../API/supabase';
import { Trash2, Edit3, Loader2, ArrowUpRight, ArrowDownLeft, Inbox, Clock, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';

const TransactionList = ({ onEdit }) => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
  const filteredData = transactions?.filter(t => {
    const matchesFilter = 
      filter === 'all' ? true : 
      filter === 'income' ? t.amount > 0 : t.amount < 0;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
    </div>
  );

  return (
    <div className="w-full">
      <div className="p-4 md:p-6 border-b border-slate-50 space-y-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={16} />
          <input 
            type="text"
            placeholder="Search by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:border-indigo-200 focus:shadow-sm transition-all"/>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock size={12} className="text-slate-400" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {filteredData?.length || 0} Results</p>
          </div>
          <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl border border-slate-100">
            {['all', 'income', 'expense'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all
                  ${filter === type 
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                    : 'text-slate-400 hover:text-slate-600'}`}>
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="divide-y divide-slate-50 min-h-[300px]">
        {filteredData?.map((t) => {
          const isIncome = t.amount > 0;
          return (
            <div 
              key={t.id}
              className="group flex flex-col sm:flex-row sm:items-center justify-between bg-white px-4 md:px-8 py-5 transition-all hover:bg-slate-50/50">
              <div className="flex items-center gap-4 mb-3 sm:mb-0">
                <div className={`w-10 h-10 flex items-center justify-center rounded-xl shrink-0 border
                  ${isIncome ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                  {isIncome ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate capitalize leading-tight">
                    {t.name}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1">
                    {new Date(t.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-6 md:gap-10 border-t sm:border-0 pt-3 sm:pt-0">
                <p className={`text-base font-black tracking-tighter ${isIncome ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {isIncome ? '+' : '-'}${Math.abs(t.amount).toLocaleString()}
                </p>
                <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-all">
                  <button onClick={() => onEdit(t)} className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-indigo-600 active:scale-90 transition-all">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => deleteMutation.mutate(t.id)} className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-rose-600 active:scale-90 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filteredData?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
              <Search className="text-slate-200" size={24} />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">No records found for "{searchQuery}"</p>
            <button 
              onClick={() => {setSearchQuery(''); setFilter('all');}} 
              className="mt-4 text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:underline">
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;