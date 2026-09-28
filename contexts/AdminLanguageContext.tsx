'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type AdminLanguage = 'bn' | 'en';

type AdminLanguageContextType = {
  language: AdminLanguage;
  setLanguage: (language: AdminLanguage) => void;
};

const AdminLanguageContext = createContext<
  AdminLanguageContextType | undefined
>(undefined);

export function AdminLanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguageState] = useState<AdminLanguage>('bn');

  useEffect(() => {
    const saved = localStorage.getItem('admin-language');

    if (saved === 'bn' || saved === 'en') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (value: AdminLanguage) => {
    setLanguageState(value);
    localStorage.setItem('admin-language', value);
  };

  return (
    <AdminLanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </AdminLanguageContext.Provider>
  );
}

export function useAdminLanguage() {
  const context = useContext(AdminLanguageContext);

  if (!context) {
    throw new Error(
      'useAdminLanguage অবশ্যই AdminLanguageProvider এর ভিতরে ব্যবহার করতে হবে'
    );
  }

  return context;
}
