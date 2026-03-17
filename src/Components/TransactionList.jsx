import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../API/supabase';
import { Trash2, Edit2, ArrowUpRight, ArrowDownRight, History } from 'lucide-react';
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
    toast.error('Transaction Removed', {
      style: {
        borderRadius: '20px',
        background: '#f8fafc',
        boxShadow: '8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff',
        fontWeight: 'bold'
      }
    });
  },
});

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-slate-400 font-bold tracking-widest text-xs uppercase">Fetching Records...</p>
    </div>
  );

  return (
    <div className="w-full px-2 py-4">
      <div className="flex justify-between items-center mb-10 px-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-xl shadow-[4px_4px_10px_#d1d1d1,-4px_-4px_10px_#ffffff]">
            <History className="text-indigo-600" size={20} />
          </div>
          <h3 className="text-2xl font-black text-slate-700 tracking-tight">Activity History</h3>
        </div>
        <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-400 shadow-[inset_2px_2px_5px_#d1d1d1,inset_-2px_-2px_5px_#ffffff] uppercase tracking-widest">
          {transactions?.length || 0} Records
        </span>
      </div>

      <div className="space-y-6">
        {transactions?.map((t) => (
          <div 
            key={t.id} 
            className="group flex items-center justify-between p-5 bg-slate-50 rounded-\[2rem] shadow-[10px_10px_20px_#d1d1d1,-10px_-10px_20px_#ffffff] border border-white/60 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-2xl shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff] ${t.amount > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {t.amount > 0 ? <ArrowUpRight size={24} strokeWidth={3} /> : <ArrowDownRight size={24} strokeWidth={3} />}
              </div>
              
              <div>
                <p className="font-black text-slate-700 text-lg capitalize leading-tight">{t.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                  {new Date(t.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-8">
              <span className={`font-black text-xl tracking-tighter ${t.amount > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {t.amount > 0 ? '+' : '-'}${Math.abs(t.amount).toLocaleString()}
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onEdit(t)} 
                  className="p-3 bg-slate-50 rounded-xl shadow-[4px_4px_8px_#d1d1d1,-4px_-4px_8px_#ffffff] text-indigo-500 hover:text-indigo-700 hover:shadow-[inset_2px_2px_5px_#d1d1d1] transition-all"
                >
                  <Edit2 size={16} strokeWidth={3} />
                </button>
                <button 
                  onClick={() => deleteMutation.mutate(t.id)} 
                  className="p-3 bg-slate-50 rounded-xl shadow-[4px_4px_8px_#d1d1d1,-4px_-4px_8px_#ffffff] text-rose-400 hover:text-rose-600 hover:shadow-[inset_2px_2px_5px_#d1d1d1] transition-all"
                >
                  <Trash2 size={16} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {transactions?.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] shadow-[inset_10px_10px_20px_#d1d1d1,inset_-10px_-10px_20px_#ffffff] border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold italic">Your ledger is empty. Time to start tracking!</p>
        </div>
      )}
    </div>
  );
};

export default TransactionList;