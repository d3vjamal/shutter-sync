
import React, { createContext, useContext, useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'success', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`
                            min-w-[300px] p-4 rounded-xl shadow-2xl backdrop-blur-md border animate-in slide-in-from-right-full duration-300
                            flex items-start gap-3
                            ${toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-100' : ''}
                            ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-100' : ''}
                            ${toast.type === 'info' ? 'bg-blue-500/10 border-blue-500/20 text-blue-100' : ''}
                        `}
                    >
                        <div className={`mt-0.5 ${toast.type === 'success' ? 'text-emerald-400' :
                                toast.type === 'error' ? 'text-red-400' : 'text-blue-400'
                            }`}>
                            {toast.type === 'success' && <CheckCircle size={18} />}
                            {toast.type === 'error' && <AlertCircle size={18} />}
                            {toast.type === 'info' && <Info size={18} />}
                        </div>
                        <div className="flex-1 text-sm font-medium">{toast.message}</div>
                        <button onClick={() => removeToast(toast.id)} className="opacity-60 hover:opacity-100">
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
