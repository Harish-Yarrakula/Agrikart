import "@/app/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import MyApp from '@/components/_app';
import { I18nextProvider } from "@/app/i18n/client";

export const metadata = {
  title: 'Agrikart',
  description: 'An Ecommerce app for farmers',
}

export default async function RootLayout({ children, params }) {
  const { lng } = await params;
  return (
    <I18nextProvider lng={lng}>
      <AuthProvider>
        <MyApp>
          {children}
        </MyApp>
      </AuthProvider>
    </I18nextProvider>
  )
}

