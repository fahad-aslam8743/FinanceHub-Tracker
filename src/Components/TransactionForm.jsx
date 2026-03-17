import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../API/supabase';
import useAuth from '../hooks/useAuth';
import { PlusCircle, Save, X, Tag, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const TransactionForm = ({ editingData, setEditingData }) => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ name: '', amount: '' });

  useEffect(() => {
    if (editingData) setFormData({ name: editingData.name, amount: editingData.amount });
  }, [editingData]);

  const mutation = useMutation({
    mutationFn: async (newData) => {
      if (editingData) {
        return await supabase.from('transactions').update(newData).eq('id', editingData.id);
      }
      return await supabase.from('transactions').insert([{ ...newData, user_id: session.user.id }]);
    },
   onSuccess: () => {
  queryClient.invalidateQueries(['transactions']);
  setFormData({ name: '', amount: '' });
  toast.success(editingData ? 'Record Updated!' : 'Transaction Added!', {
    style: {
      borderRadius: '20px',
      background: '#f8fafc',
      color: '#334155',
      border: '1px solid white',
      boxShadow: '8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff',
      fontWeight: 'bold',
      fontSize: '14px'
    },
    iconTheme: {
      primary: '#4f46e5',
      secondary: '#fff',
    },
  });
  
  setEditingData(null);
},
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ name: formData.name, amount: parseFloat(formData.amount) });
  };

  return (
    <div className="w-full max-w-xl mx-auto p-2">
      <form 
        onSubmit={handleSubmit} 
        className="bg-slate-50 p-8 rounded-[3rem] shadow-[30px_30px_60px_#bebebe,-30px_-30px_60px_#ffffff] border border-white/60 space-y-8"
      >
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-100 rounded-xl shadow-[inset_2px_2px_5px_#bcbcbc,inset_-2px_-2px_5px_#ffffff]">
                {editingData ? <Save className="text-indigo-600" size={20} /> : <PlusCircle className="text-indigo-600" size={20} />}
             </div>
             <h3 className="text-xl font-black text-slate-700">
               {editingData ? 'Edit Entry' : 'New Entry'}
             </h3>
          </div>
          {editingData && (
            <button 
              type="button"
              onClick={() => setEditingData(null)} 
              className="p-2 bg-slate-100 rounded-full shadow-[4px_4px_8px_#d1d1d1,-4px_-4px_8px_#ffffff] text-slate-400 hover:text-rose-500 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <div className="space-y-6">
          <div className="group">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-4 mb-2 block">
              Transaction Details
            </label>
            <div className="relative">
              <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Ex: Starbucks Coffee" 
                className="w-full pl-14 pr-6 py-5 bg-slate-100 rounded-\[2rem] text-slate-700 font-medium border-none shadow-[inset_6px_6px_12px_#d1d1d1,inset_-6px_-6px_12px_#ffffff] focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400"
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required
              />
            </div>
          </div>
          <div className="group">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-4 mb-2 block">
              Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="number" 
                placeholder="0.00" 
                className="w-full pl-14 pr-6 py-5 bg-slate-100 rounded-\[2rem] text-slate-700 font-bold border-none shadow-[inset_6px_6px_12px_#d1d1d1,inset_-6px_-6px_12px_#ffffff] focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400"
                value={formData.amount} 
                onChange={(e) => setFormData({...formData, amount: e.target.value})} 
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400 bg-slate-200 px-3 py-1 rounded-full shadow-[2px_2px_4px_#d1d1d1]">
                - FOR EXPENSE
              </div>
            </div>
          </div>
        </div>
        <button 
          disabled={mutation.isPending}
          className={`w-full py-5 rounded-\[2rem] font-black text-white tracking-widest uppercase text-sm transition-all flex items-center justify-center gap-3
            ${mutation.isPending 
              ? 'bg-slate-300 cursor-not-allowed shadow-none' 
              : 'bg-indigo-600 shadow-[8px_8px_16px_#c2c2c2,-8px_-8px_16px_#ffffff] hover:shadow-[4px_4px_8px_#c2c2c2,-4px_-4px_8px_#ffffff] hover:scale-[0.99] active:shadow-[inset_4px_4px_8px_#4338ca] active:scale-[0.97]'}
          `}
        >
          {mutation.isPending ? 'Syncing...' : (editingData ? 'Update Record' : 'Post Transaction')}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;