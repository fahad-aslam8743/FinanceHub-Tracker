import React, { useState, useEffect } from 'react';
import TransactionList from '../Components/TransactionList';
import TransactionForm from '../Components/TransactionForm';
import Stats from '../Components/Stats';
import { Toaster } from 'react-hot-toast';
import { Plus, X, Fingerprint, Command, Bell } from 'lucide-react';

const Dashboard = () => {
  const [editingData, setEditingData] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (editingData) setIsFormOpen(true);
  }, [editingData]);

  const closeForm = () => {
    setIsFormOpen(false);
    setTimeout(() => setEditingData(null), 300);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased selection:bg-indigo-100 overflow-x-hidden">
      <Toaster position="top-center" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] md:h-[500px] bg-gradient-to-b from-indigo-50/50 to-transparent opacity-60" />
      </div>
      <nav className="relative z-30 flex justify-between items-center px-4 md:px-12 py-5 md:py-8 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-white shadow-sm border border-slate-100 rounded-xl md:rounded-2xl flex items-center justify-center">
            <Command size={18} className="text-slate-900" />
          </div>
          <h1 className="text-base md:text-lg font-bold tracking-tight text-slate-900">FinanceHub</h1>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-[10px] md:text-xs font-semibold text-slate-500 hover:text-slate-900 transition">
          
          </button>
          <div className="w-[1px] h-3 bg-slate-200 mx-1 hidden sm:block" />
          <button className="p-2 text-slate-400 hover:text-slate-900 transition relative">
            <Bell size={18} md:size={20} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full border-2 border-white" />
          </button>
        </div>
      </nav>
      <main className={`relative z-10 transition-all duration-700 px-3 md:px-12 max-w-[1440px] mx-auto ${isFormOpen ? 'scale-[0.97] md:scale-[0.98] blur-md opacity-40' : 'scale-100'}`}>
        <section className="mb-8 md:mb-12">
          <Stats />
        </section>
        <section className="max-w-[1100px] mx-auto pb-32">
          <div className="flex items-center justify-between mb-6 md:mb-8 px-1 md:px-2">
             <h2 className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Transaction Registry</h2>
             <div className="h-[1px] flex-1 bg-slate-100 mx-4 md:mx-6 hidden xs:block" />
          </div>
          <div className="bg-white shadow-[0_2px_40px_-12px_rgba(0,0,0,0.05)] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-slate-50">
            <TransactionList onEdit={setEditingData} />
          </div>
        </section>
      </main>
      <div className="fixed bottom-6 md:bottom-10 left-0 right-0 z-40 px-6 flex justify-center pointer-events-none">
        <button 
          onClick={() => setIsFormOpen(true)}
          className="pointer-events-auto flex items-center gap-2 md:gap-3 bg-slate-900 hover:bg-black text-white px-6 md:px-8 py-3.5 md:py-5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Plus size={18} md:size={20} strokeWidth={2.5} />
          <span className="font-bold text-xs md:text-sm tracking-tight">New Transaction</span>
        </button>
      </div>
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 lg:p-8">
          <div 
            onClick={closeForm}
            className="fixed inset-0 bg-white/80 backdrop-blur-md animate-in fade-in duration-500" 
          />
          <div className="relative w-full max-w-[500px] bg-white rounded-t-[2.5rem] md:rounded-[3rem] p-8 md:p-14 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] md:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 animate-in slide-in-from-bottom md:zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto"> 
            <button 
              onClick={closeForm}
              className="absolute top-6 right-6 md:top-8 md:right-8 p-2 rounded-full text-slate-300 hover:text-slate-900 transition-all">
              <X size={20} />
            </button>
            <div className="mb-8 md:mb-10">
               <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">Add Details.</h3>
               <p className="text-xs md:text-sm text-slate-400 mt-1 md:mt-2 font-medium">Record your asset movement below.</p>
            </div>
            <TransactionForm 
              editingData={editingData} 
              setEditingData={setEditingData} 
              onSuccess={closeForm} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;