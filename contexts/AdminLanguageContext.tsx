'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

type AdminLanguage = 'bn' | 'en';

type AdminLanguageContextType = {
  language: AdminLanguage;
  setLanguage: (language: AdminLanguage) => void;
  toggleLanguage: () => void;
};

const AdminLanguageContext =
  createContext<AdminLanguageContextType | undefined>(undefined);

export function AdminLanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguageState] =
    useState<AdminLanguage>('en');

  useEffect(() => {
    const saved = localStorage.getItem(
      'admin-language'
    ) as AdminLanguage | null;

    if (saved === 'bn' || saved === 'en') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (value: AdminLanguage) => {
    setLanguageState(value);
    localStorage.setItem('admin-language', value);
  };

  const toggleLanguage = () => {
    const nextLanguage =
      language === 'bn' ? 'en' : 'bn';

    setLanguage(nextLanguage);
  };

  return (
    <AdminLanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
      }}
    >
      {children}
    </AdminLanguageContext.Provider>
  );
}

export function useAdminLanguage() {
  const context = useContext(
    AdminLanguageContext
  );

  if (!context) {
    throw new Error(
      'useAdminLanguage অবশ্যই AdminLanguageProvider এর ভিতরে ব্যবহার করতে হবে'
    );
  }

  return context;
}
