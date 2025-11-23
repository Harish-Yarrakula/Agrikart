// app/providers.js
"use client";

import { CookiesProvider } from 'react-cookie';
import { I18nextProvider } from '@/app/i18n/client';
import { AuthProvider } from '@/context/AuthContext'; // Assuming you still need this one
import { NotificationProvider } from '@/context/NotificationContext';

export function Providers({ children, lng }) {
  return (
    <CookiesProvider>
      <I18nextProvider lng={lng}>
        <NotificationProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </NotificationProvider>
      </I18nextProvider>
    </CookiesProvider>
  );
}