import React, { useState, useEffect } from 'react';
import TransactionList from '../Components/TransactionList';
import TransactionForm from '../Components/TransactionForm';
import Stats from '../Components/Stats';
import { supabase } from '../API/supabase';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Plus, X, Command, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [editingData, setEditingData] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }, []);

  const handleLogout = async () => {
    toast.dismiss();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Logout failed");
    } else {
      toast.success("Signed out successfully");
      navigate('/');
    }
  };

  // Fixed: Is function se Edit click karne par form khulega
  const handleEdit = (data) => {
    setEditingData(data);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setTimeout(() => setEditingData(null), 300);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased selection:bg-indigo-100 overflow-x-hidden">
      <Toaster 
        position="top-center" 
        toastOptions={{
          duration: 2000,
          style: {
            background: '#fff',
            color: '#0f172a',
            fontWeight: 'bold',
            borderRadius: '1rem',
            border: '1px solid #f1f5f9'
          }
        }}/>

      <nav className="relative z-30 flex justify-between items-center px-4 md:px-12 py-5 md:py-8 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-white shadow-sm border border-slate-100 rounded-xl md:rounded-2xl flex items-center justify-center">
            <Command size={18} className="text-slate-900" />
          </div>
          <h1 className="text-base md:text-lg font-bold tracking-tight text-slate-900">FinanceHub</h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={handleLogout}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-100 text-slate-500 hover:text-rose-600 transition-all shadow-sm">
            <LogOut size={18} className="transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:block text-[11px] font-black uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </nav>

      <main className={`relative z-10 transition-all duration-700 px-3 md:px-12 max-w-[1440px] mx-auto ${isFormOpen ? 'scale-[0.97] blur-md opacity-40 pointer-events-none' : 'scale-100'}`}>
        <section className="mb-8 md:mb-12">
          <Stats />
        </section>

        <section className="max-w-[1100px] mx-auto pb-32">
          <div className="flex items-center justify-between mb-6 md:mb-8 px-1">
             <h2 className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Transaction Registry</h2>
             <div className="h-[1px] flex-1 bg-slate-100 mx-4 hidden xs:block" />
          </div>
          <div className="bg-white shadow-[0_2px_40px_-12px_rgba(0,0,0,0.05)] rounded-[2rem] border border-slate-50">
            <TransactionList onEdit={handleEdit} />
          </div>
        </section>
      </main>

      {/* Floating Action Button */}
      {!isFormOpen && (
        <div className="fixed bottom-6 left-0 right-0 z-40 px-6 flex justify-center">
          <button 
            onClick={() => {
              setEditingData(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95">
            <Plus size={18} strokeWidth={2.5} />
            <span className="font-bold text-xs tracking-tight">New Transaction</span>
          </button>
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 lg:p-8">
          <div onClick={closeForm} className="fixed inset-0 bg-white/80 backdrop-blur-md animate-in fade-in" />
          <div className="relative w-full max-w-[500px] bg-white rounded-t-[2.5rem] md:rounded-[3rem] p-8 md:p-14 shadow-2xl border border-slate-100 animate-in slide-in-from-bottom">
            <button onClick={closeForm} className="absolute top-6 right-6 p-2 rounded-full text-slate-300 hover:text-slate-900 transition-all">
              <X size={20} />
            </button>
            <div className="mb-8">
               <h3 className="text-2xl font-black tracking-tighter text-slate-900">
                 {editingData ? 'Edit Record.' : 'Add Details.'}
               </h3>
               <p className="text-xs text-slate-400 mt-1 font-medium">Update your transaction details below.</p>
            </div>
            <TransactionForm 
              editingData={editingData} 
              setEditingData={setEditingData} 
              onSuccess={closeForm} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;