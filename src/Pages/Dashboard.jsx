import React, { useState, useEffect } from 'react';
import TransactionList from '../Components/TransactionList';
import TransactionForm from '../Components/TransactionForm';
import Stats from '../Components/Stats';
import { Toaster } from 'react-hot-toast';
import { Plus, X } from 'lucide-react';

const Dashboard = () => {
  const [editingData, setEditingData] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (editingData) setIsFormOpen(true);
  }, [editingData]);

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white antialiased overflow-x-hidden">

      <Toaster position="top-center" />

      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-500/30 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

      {/* Main */}
      <main
        className={`relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 transition-all duration-500 ${
          isFormOpen ? 'scale-[0.97] blur-sm brightness-75' : ''
        }`}
      >

        {/* Header */}
        <header className="flex justify-between items-end mb-10">
          <div>
            <p className="text-xs tracking-[0.3em] text-indigo-400 uppercase font-semibold">
              Overview
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Wallet
            </h1>
          </div>

          {/* Add Button */}
          <button
            onClick={() => setIsFormOpen(true)}
            className="backdrop-blur-xl bg-white/10 border border-white/20 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition"
          >
            <Plus size={24} />
          </button>
        </header>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Stats */}
          <div className="lg:col-span-1 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-5">
            <Stats />
          </div>

          {/* Transactions */}
          <div className="lg:col-span-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-5">
            <h2 className="text-lg font-semibold mb-4 text-white/80">
              Latest Activity
            </h2>
            <TransactionList onEdit={setEditingData} />
          </div>

        </div>
      </main>

      {/* Bottom Sheet */}
      <div className={`fixed inset-0 z-50 ${isFormOpen ? 'visible' : 'invisible'}`}>

        {/* Overlay */}
        <div
          onClick={closeForm}
          className={`absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-500 ${
            isFormOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Sheet */}
        <div
          className={`absolute bottom-0 left-0 right-0 max-w-[600px] mx-auto 
          backdrop-blur-2xl bg-white/10 border border-white/20 
          rounded-t-[2.5rem] p-6 sm:p-8 shadow-2xl 
          transition-all duration-500 
          ${isFormOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
        >

          {/* Grabber */}
          <div className="w-12 h-1.5 bg-white/30 rounded-full mx-auto mb-6" />

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl sm:text-2xl font-semibold">
              {editingData ? 'Edit Entry' : 'New Entry'}
            </h3>

            <button
              onClick={closeForm}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <div className="pb-4">
            <TransactionForm
              editingData={editingData}
              setEditingData={setEditingData}
              onSuccess={closeForm}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;