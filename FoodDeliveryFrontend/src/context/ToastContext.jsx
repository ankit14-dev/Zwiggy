import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = ++toastId;
        setToasts((prev) => [...prev, { id, message, type }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const success = useCallback((message) => addToast(message, 'success'), [addToast]);
    const error = useCallback((message) => addToast(message, 'error'), [addToast]);
    const warning = useCallback((message) => addToast(message, 'warning'), [addToast]);
    const info = useCallback((message) => addToast(message, 'info'), [addToast]);

    const value = { addToast, removeToast, success, error, warning, info };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

function ToastContainer({ toasts, removeToast }) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3">
            {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
}

function Toast({ toast, onClose }) {
    const getConfig = () => {
        switch (toast.type) {
            case 'success':
                return {
                    icon: <CheckCircle className="w-5 h-5" />,
                    bgColor: 'bg-[#48c479]',
                    textColor: 'text-white',
                };
            case 'error':
                return {
                    icon: <AlertCircle className="w-5 h-5" />,
                    bgColor: 'bg-[#e23744]',
                    textColor: 'text-white',
                };
            case 'warning':
                return {
                    icon: <AlertTriangle className="w-5 h-5" />,
                    bgColor: 'bg-[#db7c38]',
                    textColor: 'text-white',
                };
            default:
                return {
                    icon: <Info className="w-5 h-5" />,
                    bgColor: 'bg-[#3d4152]',
                    textColor: 'text-white',
                };
        }
    };

    const config = getConfig();

    return (
        <div
            className={`flex items-center gap-3 px-5 py-3.5 rounded-lg shadow-[0_6px_30px_rgba(0,0,0,0.25)] animate-slide-up min-w-[280px] ${config.bgColor} ${config.textColor}`}
        >
            {config.icon}
            <p className="font-medium text-sm flex-1">{toast.message}</p>
            <button
                onClick={onClose}
                className="ml-2 opacity-80 hover:opacity-100 transition-opacity"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
