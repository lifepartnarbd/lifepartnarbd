'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

type AdminLanguage = 'bn' | 'en';

type AdminLanguageContextType = {
  language: AdminLanguage;
  setLanguage: (language: AdminLanguage) => void;
};

const AdminLanguageContext =
  createContext<AdminLanguageContextType | undefined>(
    undefined
  );

export function AdminLanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguageState] =
    useState<AdminLanguage>('bn');

  useEffect(() => {
    const saved =
      localStorage.getItem('admin-language');

    if (saved === 'bn' || saved === 'en') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (
    newLanguage: AdminLanguage
  ) => {
    setLanguageState(newLanguage);

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'admin-language',
        newLanguage
      );
    }
  };

  return (
    <AdminLanguageContext.Provider
      value={{
        language,
        setLanguage,
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
      'useAdminLanguage must be used inside AdminLanguageProvider'
    );
  }

  return context;
}
