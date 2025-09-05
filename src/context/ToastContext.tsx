import React, { createContext, useContext, useState, useEffect } from 'react';
import Toast from '../components/Toast';

interface ToastState {
    message: string;
    type: 'success' | 'error';
}

const ToastContext = createContext<any>(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toast, setToast] = useState<ToastState | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
         setToast({ message, type });

    };

    const closeToast = () => {
        setToast(null);
    };

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => {
                closeToast();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={closeToast}
                />
            )}
        </ToastContext.Provider>
    );
};
