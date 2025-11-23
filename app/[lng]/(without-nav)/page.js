'use client'
import { useState, useEffect } from 'react';
import FaultyTerminal from "@/reactbits/FaultyTerminal";
import TextType from "@/reactbits/TextType";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { Button as LoadingButton } from '@/components/ui/ButtonWithLoading';

export default function Home() {

  const { t, i18n } = useTranslation("common");
  const [pageContent, setPageContent] = useState(null);

  useEffect(() => {
    const languageCookie = document.cookie.split('; ').find(row => row.startsWith('i18next='));
    if (languageCookie) {
      setPageContent('main');
    } else {
      setPageContent('selector');
    }
  }, []);

  const handleLanguageSelect = (lang) => {
    setTimeout(() => {
      try {
        if (i18n?.changeLanguage) {
          i18n.changeLanguage(lang);
        }
        // set i18next cookie for future visits (1 year)
        const maxAge = 60 * 60 * 24 * 365;
        document.cookie = `i18next=${lang}; max-age=${maxAge}; path=/; SameSite=Lax`;
        // redirect to the selected language root
        window.location.href = `${window.location.origin}/${lang}`;
      } catch (err) {
        console.error('Language switch failed', err);
        window.location.href = `${window.location.origin}/${lang}`;
      }
    }, 100);
  };

  if (pageContent === 'selector') {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-black text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">{t('languageSelector.title')}</h1>
        <div className="grid grid-cols-2 md:flex md:flex-row gap-4">
          <LoadingButton onClick={() => handleLanguageSelect('te')} className="bg-transparent border border-white rounded-full text-white font-bold py-3 px-6 text-lg hover:bg-white hover:text-black transition-colors duration-300">తెలుగు</LoadingButton>
          <LoadingButton onClick={() => handleLanguageSelect('hi')} className="bg-transparent border border-white rounded-full text-white font-bold py-3 px-6 text-lg hover:bg-white hover:text-black transition-colors duration-300">हिन्दी</LoadingButton>
          <LoadingButton onClick={() => handleLanguageSelect('en')} className="bg-transparent border border-white rounded-full text-white font-bold py-3 px-6 text-lg hover:bg-white hover:text-black transition-colors duration-300">English</LoadingButton>
          <LoadingButton onClick={() => handleLanguageSelect('ta')} className="bg-transparent border border-white rounded-full text-white font-bold py-3 px-6 text-lg hover:bg-white hover:text-black transition-colors duration-300">தமிழ்</LoadingButton>
        </div>
      </div>
    );
  }

  if (pageContent === 'main') {
    return (
      <>
        <div className="w-full h-full">
          <div className="w-full h-full">
          <FaultyTerminal />
          </div>
            <div className="absolute top-0 left-0 w-full h-screen z-0">
              <div className="flex flex-col items-center justify-center h-screen w-full bg-transparent text-white absolute z-1 ">
                <TextType
                  text={[
                    "Welcome to AgriKart!",
                    "అగ్రికార్ట్‌కు స్వాగతం!",
                    "एग्रीकार्ट में आपका स्वागत है!",
                    "அக்ரிகார்ட்டிற்கு வரவேற்கிறோம்!"
                  ]}
                  typingSpeed={80}
                  pauseDuration={1500}
                  showCursor={true}
                  cursorCharacter="<"
                />
                <p className="text-lg w-2/3 md:w-1/3 text-center md:text-xl">{t('home.tagline')}
                </p>
                <section className="flex items-center justify-center mt-8 gap-6">
                  <Link className="bg-white text-gray-800 font-bold py-2 px-4 rounded-full" href={"/login"}>
                    {t('home.buttons.login')}
                  </Link>
                  <LoadingButton className="bg-transparent border border-white rounded-full text-white-800 font-bold py-2 px-4">{t('home.buttons.learnMore')}</LoadingButton>
                </section>
              </div>
            </div>
          </div>
      </>
    );
  }

  return null;
}