import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import SiteChrome from '@/components/SiteChrome';

export const metadata = {
  title: 'Life Partner BD',
  description: 'হালাল উপায়ে জীবনসঙ্গী খোঁজার প্ল্যাটফর্ম',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className="bg-gray-50 text-gray-900 antialiased font-sans flex flex-col min-h-screen">
        <AuthProvider>
          <SiteChrome>{children}</SiteChrome>
        </AuthProvider>
      </body>
    </html>
  );
}
