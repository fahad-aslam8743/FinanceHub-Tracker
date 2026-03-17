import React, { useState, useRef } from 'react';
import TransactionList from '../Components/TransactionList';
import TransactionForm from '../Components/TransactionForm';
import Stats from '../Components/Stats';
import { Toaster } from 'react-hot-toast';

const Dashboard = () => {
  const [editingData, setEditingData] = useState(null);
  const formRef = useRef(null);

  const handleEdit = (data) => {
    setEditingData(data);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-slate-800 transition-colors duration-500 overflow-x-hidden">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-8 md:space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6 px-2">
          <div>
            <h1 className="text-3xl md:text-4xl font-[1000] tracking-tighter text-slate-800 italic">
              FINANCE<span className="text-indigo-600 font-black">HUB</span>
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em]">Smart Ledger v1.0</p>
            </div>
          </div>
          <div className="hidden sm:block bg-white/60 backdrop-blur-md px-5 py-2 rounded-2xl shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff] border border-white">
            <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase text-center">Cloud Synced</p>
          </div>
        </header>
        <Stats />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          <div ref={formRef} className="lg:col-span-4 space-y-6 order-1"> 
            <TransactionForm editingData={editingData} setEditingData={setEditingData} />
            <div className="p-5 bg-slate-50 rounded-\[2rem] shadow-[10px_10px_20px_#d1d1d1,-10px_-10px_20px_#ffffff] border border-white/80 relative overflow-hidden group">
              <div className="relative z-10 flex items-start gap-4">
                <div className="w-1 h-12 bg-indigo-500 rounded-full mt-1"></div>
                <div>
                  <h4 className="font-black text-slate-400 uppercase text-[9px] tracking-[0.2em] mb-1">
                    Daily Insight
                  </h4>
                  <p className="text-sm text-slate-600 font-semibold leading-relaxed italic pr-4">
                    "Do not save what is left after spending, but spend what is left after saving."
                  </p>
                  <p className="text-[9px] font-black text-indigo-400 mt-2 uppercase tracking-tighter opacity-70">
                    — W. Buffett
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/40 rounded-full blur-xl -mr-8 -mt-8 pointer-events-none"></div>
            </div>
          </div>
          <div className="lg:col-span-8 order-2">
            <TransactionList onEdit={handleEdit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;