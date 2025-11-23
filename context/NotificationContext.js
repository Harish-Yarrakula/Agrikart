"use client";

import React, { createContext, useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  // addToast provides a simple wrapper around react-hot-toast
  const addToast = ({ title = '', description = '', type = 'info', duration = 4000 }) => {
    const message = description ? `${title} — ${description}` : title;
    const opts = { duration };
    if (type === 'success') return toast.success(message, opts);
    if (type === 'error') return toast.error(message, opts);
    return toast(message, opts);
  };

  const removeToast = (id) => toast.dismiss(id);

  return (
    <NotificationContext.Provider value={{ addToast, removeToast }}>
      {children}
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
};

export default NotificationContext;
