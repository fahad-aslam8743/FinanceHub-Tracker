import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../API/supabase';
import { Trash2, Edit3, Loader2, ArrowUpRight, ArrowDownLeft, Inbox } from 'lucide-react';
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
      toast.success('Deleted');
    },
  });

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
    </div>
  );

  return (
    <div className="w-full px-4 pb-16 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-xl font-semibold text-white/90">Recent</h3>
          <p className="text-[10px] text-white/40 uppercase tracking-widest">
            {transactions?.length || 0} records
          </p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">

        {transactions?.map((t) => {
          const isIncome = t.amount > 0;

          return (
            <div 
              key={t.id}
              className="group flex items-center justify-between 
              backdrop-blur-xl bg-white/[0.06] border border-white/10 
              rounded-2xl px-4 py-3 
              transition-all duration-300 
              hover:bg-white/[0.08] hover:scale-[1.01]"
            >

              {/* LEFT */}
              <div className="flex items-center gap-3 min-w-0">

                {/* Icon */}
                <div className={`w-10 h-10 flex items-center justify-center rounded-xl
                  ${isIncome 
                    ? 'bg-green-500/15 text-green-400' 
                    : 'bg-rose-500/15 text-rose-400'
                  }`}
                >
                  {isIncome 
                    ? <ArrowUpRight size={18} /> 
                    : <ArrowDownLeft size={18} />
                  }
                </div>

                {/* Info */}
                <div className="truncate">
                  <p className="text-sm font-semibold text-white truncate capitalize">
                    {t.name}
                  </p>
                  <p className="text-[10px] text-white/40">
                    {new Date(t.created_at).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short'
                    })}
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3">

                {/* Amount */}
                <p className={`text-sm font-semibold ${
                  isIncome ? 'text-green-400' : 'text-rose-400'
                }`}>
                  {isIncome ? '+' : '-'}{Math.abs(t.amount)}
                </p>

                {/* Actions (hidden until hover) */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">

                  <button 
                    onClick={() => onEdit(t)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-indigo-400 transition"
                  >
                    <Edit3 size={14} />
                  </button>

                  <button 
                    onClick={() => deleteMutation.mutate(t.id)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-rose-400 transition"
                  >
                    <Trash2 size={14} />
                  </button>

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Empty */}
      {transactions?.length === 0 && (
        <div className="text-center py-16">
          <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-white/10">
            <Inbox className="text-white/40" size={26} />
          </div>
          <p className="text-white/40 text-sm">No transactions yet</p>
        </div>
      )}

    </div>
  );
};

export default TransactionList;