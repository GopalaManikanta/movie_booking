import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ToastNotification = () => {
  const { toast } = useAuth();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />;
      case 'error':
        return <AlertCircle className="text-rose-500 shrink-0" size={20} />;
      default:
        return <Info className="text-rose-600 shrink-0" size={20} />;
    }
  };

  return (
    <div className="fixed top-6 right-6 z-[100] bg-white rounded-xl px-5 py-3.5 shadow-2xl border border-rose-200 transition-all duration-300 transform translate-y-0 opacity-100">
      <div className="flex items-center gap-3">
        {getIcon()}
        <span className="text-slate-800 text-sm font-semibold tracking-tight">{toast.message}</span>
      </div>
    </div>
  );
};

export default ToastNotification;
